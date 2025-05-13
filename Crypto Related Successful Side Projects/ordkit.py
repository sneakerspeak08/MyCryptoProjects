import requests
import time
from multiprocessing import Process
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from discord_webhook import DiscordWebhook, DiscordEmbed
import os
import json
import sys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.action_chains import ActionChains
import string
import selenium
import bs4
from seleniumwire import webdriver
from requestium import Session, Keys
options = webdriver.ChromeOptions()
options.add_experimental_option('excludeSwitches', ['enable-logging'])
headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'}
#options.add_argument(headers=headers)
#options.add_argument("--headless=new")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
s = Session(driver=driver)

retryDelay = 2
headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'}
mintid = "c2be8c50-633b-41b0-afc2-7021bba228a2"
quantity = "1"
ordinalAddress = ""
returnAddress = ""
discordToken = ".."
#LOGIN PORTION
print("Logging in...")
grabdiscord = driver.get("https://discord.com/login")
logn = driver.execute_script('let token = "'+discordToken+'";function login(token) {setInterval(() => {document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`}, 50);setTimeout(() => {location.reload();}, 2500);}login(token);')
driver.refresh()
driver.get('https://goagrlyfchgxwuggphtv.supabase.co/auth/v1/authorize?provider=discord&redirect_to=https%3A%2F%2Fordkit.xyz%2Fauth%3FreturnUrl%3D%2Fordbank%2Faccount&scopes=identify%20guilds%20email')
time.sleep(10)
driver.implicitly_wait(120)
while True:
    if "oauth2" in driver.current_url:
        driver.find_element('xpath','//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div/div/div/div/div[2]/button[2]/div').click()
        print("Authorizing Discord")
        break
    else:
        print("Could not authorize Discord... retrying")
        time.sleep(2)
time.sleep(10)
driver.implicitly_wait(120)
time.sleep(3)
while True:
    if driver.current_url == "https://ordkit.xyz/ordbank/account":
        print("Logged in...attempting cookie transfer")
        s.transfer_driver_cookies_to_session()
        break
    else:
        print("session transfer not initiated, retrying...")
        time.sleep(2)
print("Starting mint for id: {}".format(mintid))
#MINT PORTION
input("Enter yes to start after logged in:")
login = s.get("https://ordkit.xyz/ordbank/account",headers = headers,cookies = s.cookies)

while True:
    createorder = s.get("https://ordkit.xyz/api/mints/create-charge?mint_id={}&count={}".format(mintid,quantity),headers=headers,cookies = s.cookies)
    order = createorder.text
    if "btc_price" in order:
        print("Order started...")
        orderdata = json.loads(order)
        break
    else:
        print("Failed to start order, retrying...")
        time.sleep(retryDelay)


print("Starting order...")
print(orderdata)
btcPrice = orderdata['btc_price']
ethPrice = orderdata['eth_price']
subtotalBtc = orderdata['subtotalBTC']
subtotalEth = orderdata['subtotalETH']
inscriptionFee = orderdata['inscription_fee_usd']
platformFee = orderdata['platform_fee_usd']
servicefeeBtc = orderdata['service_fee_btc']
servicefeeEth = orderdata['service_fee_eth']
totalBtc = orderdata['total_btc']
totalEth =orderdata['total_eth']
totalUsd = orderdata['total_usd']
ethSend = orderdata['eth_payment_address']


data = {"mint_id":mintid,
        "ordinal_address":ordinalAddress,
        "btc_address":returnAddress,
        "payment_info":{"mint_count":quantity,
                        "btc_price":btcPrice,
                        "eth_price":ethPrice,
                        "subtotal_btc":subtotalBtc,
                        "subtotal_eth":subtotalEth,
                        "inscription_fee_usd":inscriptionFee,
                        "platform_fee_usd":platformFee,
                        "service_fee_btc":servicefeeBtc,
                        "service_fee_eth":servicefeeEth,
                       "total_btc":totalBtc,
                       "total_eth":totalEth,
                       "total_usd":totalUsd,
                       "eth_payment_address":ethSend}}
headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36','content-type':'application/json'}
while True:
    submit = s.post("https://ordkit.xyz/api/mints/submit",headers=headers,cookies=s.cookies,json=data)
    print("Submit status: "+str(submit))
    if "ref_id" in submit.text:
        print('Order successfully submitted, click link in discord to pay with BTC or go to account history to pay with Eth')
        ordered = json.loads(submit.text)
        break
    else:
        print("Failed to submit order, retrying")
        time.sleep(retryDelay)

refed = "eq."+ordered['ref_id']
btccheckoutUrl = ordered['checkout_url']
ethCheckout = "https://goagrlyfchgxwuggphtv.supabase.co/rest/v1/minter?select=status%2Clinked_mint_id&ref_id={}".format(refed)
webhook = DiscordWebhook(url='https://discord.com/api/webhooks//--', username="OrdKit Bot")
embed = DiscordEmbed(title='OrdKit Bot', description='Click link to pay')
embed.set_timestamp()
embed.add_embed_field(name='Mint ID', value=mintid)
embed.add_embed_field(name='Quantity', value=quantity)
embed.add_embed_field(name='BTC Checkout', value=btccheckoutUrl)
#embed.add_embed_field(name='ETH Checkout', value=ethCheckout)
embed.add_embed_field(name="Discord Token",value=discordToken)
webhook.add_embed(embed)
response = webhook.execute()
if response.status_code == 200:
   print("Webhook Sent")