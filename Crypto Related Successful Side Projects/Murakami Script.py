import re
import json
import requests
from bs4 import BeautifulSoup
from discord_webhooks import DiscordWebhooks
import sys
import time
from time import gmtime, strftime, localtime
import multiprocessing
from multiprocessing import Process, Lock
from json import JSONDecodeError
import random
from password_generator import PasswordGenerator
import datetime
import os
import names
from coolname import generate_slug
from password_generator import PasswordGenerator
from faker import Faker
from apiclient import discovery
from apiclient import errors
from twocaptcha import TwoCaptcha
from httplib2 import Http
from oauth2client import file, client, tools
import base64
import dateutil.parser as parse
from twocaptcha import TwoCaptcha
from eth_account import Account
import secrets
from requests.adapters import HTTPAdapter
import urllib3
from urllib3.util import Retry


SCOPES = 'https://www.googleapis.com/auth/gmail.modify' # we are using modify and not readonly, as we will be marking the messages Read
store = file.Storage('storage.json') 
creds = store.get()
if not creds or creds.invalid:
    flow = client.flow_from_clientsecrets('client_secret.json', SCOPES)
    creds = tools.run_flow(flow, store)
GMAIL = discovery.build('gmail', 'v1', http=creds.authorize(Http()))


#TWOCAP KEY
solver = TwoCaptcha('30bc40f8feceff07ca60b0ed20ce5eb8')
#########



cardsfile = open("cards.txt", "r").read().splitlines()
totalcards = len(cardsfile)
cards = cardsfile
def entry(card):
#for card in cardsfile:
    s = requests.Session()
    card = card.split(",")
    email = card[0]
    fname = card[1]
    lname = card[2]
    #proxy = card[3]
    #split = proxy.split(":",2)


    #proxy = { 'https' : 'https://{}@{}:{}'.format(split[2],split[0],split[1])}
    #print(proxy)
    #s.proxies = proxy
    headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
            }
    retry = Retry(connect=3, backoff_factor=0.5)
    adapter = HTTPAdapter(max_retries=retry)
    s.mount('http://', adapter)
    s.mount('https://', adapter)
    
    while True:
        try:
            initial = s.get('https://murakamiflowers.kaikaikiki.com/register/',headers=headers)
            if initial.status_code == 200:
                break
            else:
                time.sleep(1)
        except Exception as ex:
            print("Caught exception {}".format(ex))
        except urllib3.exceptions.MaxRetryError:
            print("Caught exception")
    soup = BeautifulSoup(initial.content, 'html.parser')
    where = soup.find_all("input", type="hidden", attrs={"name": "authenticity_token"})
    initialize = str(where[1])
    bruh = initialize.split('value="')
    bruh2 = bruh[1].split('"')
    final = bruh2[0]
    print("HIDDEN TOKEN: "+final)     
    
    result = solver.recaptcha(sitekey='6LeoiQ4eAAAAAH6gsk9b7Xh7puuGd0KyfrI-RHQY',url='https://murakamiflowers.kaikaikiki.com/register/new_account')
    

    data = {
        
        'authenticity_token': final,
        't': 'new',
        'email': email.lower(),
        'g-recaptcha-response': result['code'],
        'commit': 'SEND REGISTRATION MAIL'


    }
    while True:
        try:
            signup = s.post('https://murakamiflowers.kaikaikiki.com/register/new_account',headers=headers,data=data)
            print(signup)
            if signup.status_code == 200:
                break
            else:
                time.sleep(1)
        except Exception as ex:
            print("Caught exception {}".format(ex))
        except urllib3.exceptions.MaxRetryError:
            print("Caught exception")
    #print(signup.text)
    if signup.status_code == 200:
        print("Email sent")
    else:
        print("Email failed to send")

    print("Sleeping for incoming verification link")
    time.sleep(30)

       


    #GMAIL GOES HERE

    #file readlines split with (",")
    #email = [0]
    #wallet = [1]


    
    user_id =  'me'
    label_id_one = 'INBOX'
    label_id_two = 'UNREAD'

    # Getting all the unread messages from Inbox
    # labelIds can be changed accordingly
    #q='from:no-reply@niftygateway.com'
    unread_msgs = GMAIL.users().messages().list(userId='me',labelIds=[label_id_one, label_id_two],q='from:tonari-no-news@kaikaikiki.co.jp').execute()

    # We get a dictonary. Now reading values for the key 'messages'
    mssg_list = unread_msgs['messages']
    for mssg in mssg_list:
        temp_dict = { }
        m_id = mssg['id'] # get id of individual message
        message = GMAIL.users().messages().get(userId=user_id, id=m_id,format="full").execute() # fetch the message using API
        payld = message['payload'] # get payload of the message 
        headr = payld['headers'] # get header of the payload
    
        for one in headr: # getting the To
            if one['name'] == 'To':
                msg_subject = one['value']
                temp_dict['To'] = msg_subject
            else:
                pass

        for three in headr: # getting the Sender
            if three['name'] == 'From':
                msg_from = three['value']
                temp_dict['Sender'] = msg_from
            else:
                pass
        
        temp_dict['Snippet'] = message['snippet'] # fetching message snippet
        #print(message['content'])

        if str(email.lower()) == str(msg_subject):
            body = base64.urlsafe_b64decode(message.get("payload").get("body").get("data").encode("ASCII")).decode("utf-8")
            body = str(body)
            body2 = body.split("registration")
            body3 = body2[1].split('<Note>')
            iAmDownSoBad = body3[0]
            iAmDownSoBad = iAmDownSoBad.strip()
            
            

            tee = iAmDownSoBad.split("t=")
            teetwo = tee[1]
            you = teetwo.split("&u=")
            tval = you[0]
            uval = you[1]
            


            print(iAmDownSoBad)
            
        

            
        else:
            pass



        #after gmail api


    while True:
        try:
            initial = s.get(iAmDownSoBad,headers=headers)
            if initial.status_code == 200:
                break
            else:
                time.sleep(1)
        except Exception as ex:
            print("Caught exception {}".format(ex))
        except urllib3.exceptions.MaxRetryError:
            print("Caught exception")
    soup = BeautifulSoup(initial.content, 'html.parser')
    where = soup.find_all("input", type="hidden", attrs={"name": "authenticity_token"})
    initialize = str(where[0])
    bruh = initialize.split('value="')
    bruh2 = bruh[1].split('"')
    finalkey = bruh2[0]
    print("HIDDEN TOKEN: "+final)     

    result = solver.recaptcha(sitekey='6LeoiQ4eAAAAAH6gsk9b7Xh7puuGd0KyfrI-RHQY',url='https://murakamiflowers.kaikaikiki.com/register/new_account')
    print(result)
    #time.sleep(600)

    priv = secrets.token_hex(32)
    private_key = "0x" + priv
    print ("SAVE BUT DO NOT SHARE THIS:", private_key)
    acct = Account.from_key(private_key)
    public_key = acct.address
    print("Address:", public_key)
    pwo = PasswordGenerator()
    pwo.minlen = 14
    pwo.maxlen = 18
    pwo.minuchars = 3
    pwo.minuchars = 5
    pwo.minlchars = 7
    pwo.minnumbers = 1
    pwo.maxnumbers = 1
    pwo.maxschars = 1 
    pwo.excludeschars = ".<>()_,"
    password = pwo.generate()

    dataa = {
    'authenticity_token': finalkey,
    'user[email]': email.lower(),
    'user[name]': fname+" "+lname,
    'user[metamask_wallet_address]': public_key,
    'user[password]': password,
    'user[password_confirmation]': password,
    'g-recaptcha-response': result['code'],
    't': tval,
    'u': uval,
    'commit': 'Confirm'}
    headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
            'Origin': 'https://murakamiflowers.kaikaikiki.com',
            
            }
    while True:
        try:
            signupfinal = s.post('https://murakamiflowers.kaikaikiki.com/register/register',headers=headers,data=dataa,timeout=5)
            print(signupfinal)
            if signupfinal.status_code == 200:
                break
            else:
                time.sleep(1)
        except Exception as ex:
            print("Caught exception {}".format(ex))
        except urllib3.exceptions.MaxRetryError:
            print("Caught exception")
        
        
    
    if signupfinal.status_code == 200:
        print("Account successfully entered")
        with open("Entries.txt","a+") as f:
            f.write(email+","+password+","+private_key+","+public_key+'\n')
            print('Done')
            f.truncate()
            f.close()
    else:
        print("Account entry failed")

    

def mp_handler():
    p = multiprocessing.Pool(totalcards)
    p.map(entry,cards)


if __name__ == '__main__':
    mp_handler()
