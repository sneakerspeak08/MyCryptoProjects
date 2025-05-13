import re
import json
import requests
from bs4 import BeautifulSoup
from discord_webhooks import DiscordWebhooks
import sys
import pause
import time
from time import gmtime, strftime, localtime
import multiprocessing
import random
import datetime
from apiclient import discovery
from apiclient import errors
from httplib2 import Http
from oauth2client import file, client, tools
import base64
import dateutil.parser as parser
from twocaptcha import TwoCaptcha
#from datetime import datetime

accountsfile = open("accs.txt", "r").read().splitlines()
totalaccountnumber = len(accountsfile)
accounts = accountsfile
SLACK_URL = ''
DISCORD_URL = ''
contact = "0x3cfeabc52e9b88af956f418d8737072bc93dfc67" 
twocap = '322d43331056414358ce14d7a135f1d0'
tokenid = "3"
tokenidtwo = "5"
tokenidtree = "6"

delay = "2"
#droptime = datetime.datetime(2021, 3, 24, 16, 33, 10)

def entry(account):
    s = requests.Session()
    splitit = account.split(',')
    login = splitit[0].split(":")
    email = login[0]
    password = login[1]
    choice = splitit[1]
    oldtoken = splitit[2]
    split = choice.split(":",2)
    proxy = { 'https' : 'https://{}@{}:{}'.format(split[2],split[0],split[1])}
    s.proxies = proxy
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'}
    login = s.get('https://niftygateway.com/new-login',headers=headers)
    if login.status_code == 200:
        print('Starting login')
        data = {
        'grant_type': 'refresh_token',
        'client_id': '',
        'refresh_token': oldtoken,
        }
        log = s.post('https://api.niftygateway.com/o/token/',headers=headers,data=data)
        if log.status_code == 200:
                print('Logged In',email)
                gettok = json.loads(log.text)
                authcode = gettok['access_token']
                refreshtoken = gettok['refresh_token']
                data = {
                    'text': 'Login Info={}:{},{},{}'.format(email,password,choice,refreshtoken)
                }
                response = requests.post(SLACK_URL, data=json.dumps(data), headers={'Content-Type': 'application/json'})
                if response.status_code==200:
                    print('New token sent to slack')
                else:
                    print('Failed to send token')
                buyheaders = {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Authorization': 'Bearer {}'.format(authcode),
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Host': 'api.niftygateway.com',
                    'Origin': 'https://niftygateway.com',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'}
                try:
                    running = True
                    while running:
                        cc = s.get('https://api.niftygateway.com/stripe/list-cards/',headers=buyheaders)
                        getcc = json.loads(cc.text)
                        print(getcc)
                        cctoken = getcc['data'][0]['id']
                        ccfingerprint = getcc['data'][0]['fingerprint']
                        print('Got Card Info',cctoken+" "+ccfingerprint)
                        running = False
                except IndexError:
                    running = True
                
                try:
                    while True:
                        solver = TwoCaptcha(twocap)
                        result = solver.recaptcha(sitekey='6LeMnHgaAAAAAGKJeoPpHDYHdomeGkU5_RG1y0n_',url='https://niftygateway.com/enterdrawing/?contractAddress={}&niftyType={}'.format(contact,tokenid))
                        capcode = result['code']
                        if capcode == '':
                            print('Captcha token not found retrying')
                            time.sleep(1)
                        else:
                            print('Got captcha token')
                            break
                except IndexError:
                    print('2Cap Error, retrying')
                    solver = TwoCaptcha(twocap)
                    result = solver.recaptcha(sitekey='6LeMnHgaAAAAAGKJeoPpHDYHdomeGkU5_RG1y0n_',url='https://niftygateway.com/enterdrawing/?contractAddress={}&niftyType={}'.format(contact,tokenid))
                    capcode = result['code']
                #print('Waiting until drop time')
                #dt = droptime
                #pause.until(dt)
                data={
                'captcha_token': capcode,
                'cc_token': cctoken,
                'contractAddress': contact,
                'fingerprint': ccfingerprint,
                'niftyType': tokenid,
                'paymentType': 'card'
                }
                time.sleep(random.randint(5,20))
                pay = s.post('https://api.niftygateway.com/drawing/enter/',headers=buyheaders,data=data)
                status = pay.text
                print(status)
                if pay.status_code == 200:
                    print('Entry Success',email)
                    WEBHOOK_URL = DISCORD_URL
                    webhook = DiscordWebhooks(WEBHOOK_URL)
                    webhook.set_content(title=contact, color=0xFFFF00)
                    webhook.add_field(name="Status",value=status)
                    webhook.set_author(name='NiftyGateway')
                    webhook.add_field(name='Email',value="||{}||".format(email))
                    webhook.add_field(name='Password',value="||{}||".format(password))
                    webhook.set_footer(text='Ethan#8000')
                    webhook.send()
                    try:
                        while True:
                            solver = TwoCaptcha(twocap)
                            result = solver.recaptcha(sitekey='6LeMnHgaAAAAAGKJeoPpHDYHdomeGkU5_RG1y0n_',url='https://niftygateway.com/enterdrawing/?contractAddress={}&niftyType={}'.format(contact,tokenidtwo))
                            capcode = result['code']
                            if capcode == '':
                                print('Captcha token not found retrying')
                                time.sleep(1)
                            else:
                                print('Got captcha token')
                                break
                    except IndexError:
                        print('2Cap Error, retrying')
                        solver = TwoCaptcha(twocap)
                        result = solver.recaptcha(sitekey='6LeMnHgaAAAAAGKJeoPpHDYHdomeGkU5_RG1y0n_',url='https://niftygateway.com/enterdrawing/?contractAddress={}&niftyType={}'.format(contact,tokenidtwo))
                        capcode = result['code']
                    #print('Waiting until drop time')
                    #dt = droptime
                    #pause.until(dt)
                    data={
                    'captcha_token': capcode,
                    'cc_token': cctoken,
                    'contractAddress': contact,
                    'fingerprint': ccfingerprint,
                    'niftyType': tokenidtwo,
                    'paymentType': 'card'
                    }
                    time.sleep(random.randint(5,20))
                    pay = s.post('https://api.niftygateway.com/drawing/enter/',headers=buyheaders,data=data)
                    status = pay.text
                    print(status)
                    if pay.status_code == 200:
                        print('Entry Success',email)
                        WEBHOOK_URL = DISCORD_URL
                        webhook = DiscordWebhooks(WEBHOOK_URL)
                        webhook.set_content(title=contact, color=0xFFFF00)
                        webhook.add_field(name="Status",value=status)
                        webhook.set_author(name='NiftyGateway')
                        webhook.add_field(name='Email',value="||{}||".format(email))
                        webhook.add_field(name='Password',value="||{}||".format(password))
                        webhook.set_footer(text='Ethan#')
                        webhook.send()
                        try:
                            while True:
                                solver = TwoCaptcha(twocap)
                                result = solver.recaptcha(sitekey='6LeMnHgaAAAAAGKJeoPpHDYHdomeGkU5_RG1y0n_',url='https://niftygateway.com/enterdrawing/?contractAddress={}&niftyType={}'.format(contact,tokenidtree))
                                capcode = result['code']
                                if capcode == '':
                                    print('Captcha token not found retrying')
                                    time.sleep(1)
                                else:
                                    print('Got captcha token')
                                    break
                        except IndexError:
                            print('2Cap Error, retrying')
                            solver = TwoCaptcha(twocap)
                            result = solver.recaptcha(sitekey='6LeMnHgaAAAAAGKJeoPpHDYHdomeGkU5_RG1y0n_',url='https://niftygateway.com/enterdrawing/?contractAddress={}&niftyType={}'.format(contact,tokenidtree))
                            capcode = result['code']
                        #print('Waiting until drop time')
                        #dt = droptime
                        #pause.until(dt)
                        data={
                        'captcha_token': capcode,
                        'cc_token': cctoken,
                        'contractAddress': contact,
                        'fingerprint': ccfingerprint,
                        'niftyType': tokenidtree,
                        'paymentType': 'card'
                        }
                        time.sleep(random.randint(5,20))
                        pay = s.post('https://api.niftygateway.com/drawing/enter/',headers=buyheaders,data=data)
                        status = pay.text
                        print(status)
                        if pay.status_code == 200:
                            print('Entry Success',email)
                            WEBHOOK_URL = DISCORD_URL
                            webhook = DiscordWebhooks(WEBHOOK_URL)
                            webhook.set_content(title=contact, color=0xFFFF00)
                            webhook.add_field(name="Status",value=status)
                            webhook.set_author(name='NiftyGateway')
                            webhook.add_field(name='Email',value="||{}||".format(email))
                            webhook.add_field(name='Password',value="||{}||".format(password))
                            webhook.set_footer(text='Ethan#')
                            webhook.send()
                        else:
                            print('Entry failed')
                    else:
                        print('Entry failed')
                
                elif pay.status_code == 400:
                    print('Entry Failed',email)
                    WEBHOOK_URL = DISCORD_URL
                    webhook = DiscordWebhooks(WEBHOOK_URL)
                    webhook.set_content(title=contact, color=0xFFFF00)
                    webhook.add_field(name="Status",value=status)
                    webhook.set_author(name='NiftyGateway')
                    webhook.add_field(name='Email',value="||{}||".format(email))
                    webhook.add_field(name='Password',value="||{}||".format(password))
                    webhook.set_footer(text='Ethan#')
                    webhook.send()
                    #running = False
                
        else:
            print('Login failed')
    else:
        print('Getting login page failed')


def mp_handler():
    p = multiprocessing.Pool(totalaccountnumber)
    p.map(entry, accounts)


if __name__ == '__main__':
    mp_handler()



