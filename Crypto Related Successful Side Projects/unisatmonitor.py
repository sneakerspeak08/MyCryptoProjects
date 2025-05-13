import requests
import time
import satoshi
import os
import json
import sys
import string


s = requests.Session()
headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'}
data = {"filter":{"nftType":"brc20","nftConfirm":"true","isEnd":"false","tick":"oxbt"},"sort":{"unitPrice":1},"start":0,"limit":20}


while True:
    getList = s.post("https://market-api.unisat.io/unisat-market-v2/auction/list",headers=headers,json=data)
    theList = json.loads(getList.text)

    currentFloor = theList['data']['list'][0]['unitPrice']
    amount = theList['data']['list'][0]['amount']
    tick = theList['data']['list'][0]['tick']
    totalPrice = theList['data']['list'][0]['price']
    amountUsd = satoshi.to_fiat(currentFloor)
    totalUsd = satoshi.to_fiat(totalPrice)
    if currentFloor < 500:
        webhook = DiscordWebhook(url='https://discord.com/api/webhooks//', username="UniSat Bot")
        embed = DiscordEmbed(title='UniSat Sniper', description='made by Ethan#8000')
        embed.set_timestamp()
        embed.add_embed_field(name='Tick', value=tick)
        embed.add_embed_field(name='Amount', value=amount)
        embed.add_embed_field(name='Current Floor Sats', value=currentFloor)
        #embed.add_embed_field(name='ETH Checkout', value=ethCheckout)
        embed.add_embed_field(name="Total Price Sats",value=totalPrice)
        embed.add_embed_field(name="Total Price USD",value=str(totalUsd))
        embed.add_embed_field(name="Price USD",value=str(amountUsd))
        webhook.add_embed(embed)
        response = webhook.execute()
        if response.status_code == 200:
            print("Webhook Sent")
        time.sleep(360)
        
    else:
        time.sleep(5)
