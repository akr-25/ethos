from flask import Flask, request, jsonify
from dotenv import load_dotenv   #for python-dotenv method
import spacy
from spacytextblob.spacytextblob import SpacyTextBlob
import pandas as pd
import os 
import requests
from flask_cors import CORS
from sentiment import sentiment_analysis

load_dotenv()                    #for python-dotenv method
APIFY_TOKEN = os.environ.get('APIFY_TOKEN')
GOOGLE_NEWS_SEARCH_API = os.environ.get('GOOGLE_NEWS_SEARCH_API')
NEWS_EXTRACTOR_API = os.environ.get('NEWS_EXTRACTOR_API')
APIFY_TOKEN_AMAN = os.environ.get('APIFY_TOKEN_AMAN')

app = Flask(__name__)

CORS(app)

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

    if news_response.status_code != 200 and news_response.status_code != 201:
        return jsonify({
            "error": "Something went wrong",
            "response": news_response.json(),
            "code": news_response.status_code,
            "success": False
        })

    for each in news_response.json():
        smart_article_extractor_body["articleUrls"].append({
            "url": each["link"]
        })
        num = num - 1
        if(num == 0):
            break

    article_response = requests.post(NEWS_EXTRACTOR_API, json = smart_article_extractor_body,params={"token": APIFY_TOKEN})

    if article_response.status_code != 200 and article_response.status_code != 201:
        return jsonify({
            "error": "Something went wrong",
            "response": article_response.json(),
            "code": article_response.status_code,
            "success": False
        })

    articles = article_response.json()
    articles = sentiment_analysis(articles)

    return jsonify({
        "gnews": news_response.json(),
        "articles": articles,
        "code": article_response.status_code,
        "success": True
    })

@app.route("/search-sync-gnews/<query>")
def search_gnews(query):

    args = request.args
    num = int(args.get("num", 50))
    image = args.get("image", False)

    if image == "true":
        image = True
    else:
        image = False

    google_news_search_body={
        "extractImages": image,
        "language": "US:en",
        "maxItems": num,
        "proxyConfiguration": {
            "useApifyProxy": True
        },
        "query": query
    }

    news_response = requests.post(GOOGLE_NEWS_SEARCH_API, json=google_news_search_body, params={"token": APIFY_TOKEN})

    if news_response.status_code != 200 and news_response.status_code != 201:
        return jsonify({
            "error": "Something went wrong",
            "response": news_response.json(),
            "code": news_response.status_code,
            "success": False
        })

    return jsonify({
        "gnews": news_response.json(),
        "code": news_response.status_code,
        "success": True
    })