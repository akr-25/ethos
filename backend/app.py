from flask import Flask, request, jsonify
from dotenv import load_dotenv   #for python-dotenv method
import os 
import requests


load_dotenv()                    #for python-dotenv method
APIFY_TOKEN = os.environ.get('APIFY_TOKEN')
GOOGLE_NEWS_SEARCH_API = os.environ.get('GOOGLE_NEWS_SEARCH_API')
NEWS_EXTRACTOR_API = os.environ.get('NEWS_EXTRACTOR_API')

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/search-sync/<query>")
def search(query):
    args = request.args
    num = int(args.get("num", 50))
    smart_article_extractor_body = {
    "articleUrls": [
        
        ]
    }
    google_news_search_body={
        "extractImages": False,
        "language": "US:en",
        "maxItems": num,
        "proxyConfiguration": {
            "useApifyProxy": True
        },
        "query": query
    }

    news_response = requests.post(GOOGLE_NEWS_SEARCH_API, json=google_news_search_body, params={"token": APIFY_TOKEN})

    for each in news_response.json():
        smart_article_extractor_body["articleUrls"].append({
            "url": each["link"]
        })
        num = num - 1
        if(num == 0):
            break

    article_response = requests.post(NEWS_EXTRACTOR_API, json = smart_article_extractor_body,params={"token": APIFY_TOKEN})


    return jsonify({
        "gnews": news_response.json(),
        "articles": article_response.json()
    })

@app.route("/search-sync-gnews/<query>")
def search_gnews(query):

    args = request.args
    num = int(args.get("num", 50))
    google_news_search_body={
        "extractImages": False,
        "language": "US:en",
        "maxItems": num,
        "proxyConfiguration": {
            "useApifyProxy": True
        },
        "query": query
    }

    news_response = requests.post(GOOGLE_NEWS_SEARCH_API, json=google_news_search_body, params={"token": APIFY_TOKEN})

    return jsonify({
        "gnews": news_response.json()
    })