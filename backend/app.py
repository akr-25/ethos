from flask import Flask, request, jsonify
from dotenv import load_dotenv   #for python-dotenv method
import os 
import requests
from flask_cors import CORS
from sentimentv4 import sentiment_analysis
from flask_pymongo import PyMongo
from articleScraper import scrapeArticle
from serpapi import GoogleSearch
import asyncio
from datetime import datetime


load_dotenv()                    #for python-dotenv method
APIFY_TOKEN = os.environ.get('APIFY_TOKEN')
GOOGLE_NEWS_SEARCH_API = os.environ.get('GOOGLE_NEWS_SEARCH_API')
NEWS_EXTRACTOR_API = os.environ.get('NEWS_EXTRACTOR_API')
APIFY_TOKEN_AMAN = os.environ.get('APIFY_TOKEN_AMAN')
MONGO_URI = os.environ.get('MONGO_URI')
SERPAPI_KEY = os.environ.get('SERPAPI_KEY')

app = Flask(__name__)
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/search-newspaper/<query>")
def searchCheap(query):
    args = request.args
    print(query)
    llist = query.split('+')
    for i in range(len(llist)):
        llist[i] = llist[i][0].upper() + llist[i][1:]
    name = ' '.join(llist)

    num = int(args.get("num", 50))

    params = {
    "q": name,
    "tbm": "nws",
    "api_key": SERPAPI_KEY,
    "num": num
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    news_results = results["news_results"]

    articles = []
    async def main(num):
        tasks = []
        for each in news_results:
            tasks.append(loop.create_task(scrapeArticle(each["link"], each, articles)))
            num = num - 1
            if num == 0:
                break
        await asyncio.wait(tasks)
            

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(main(num=num))
    loop.close()

    articles, sentiment = sentiment_analysis(name, articles)

    mongo.db.articles.insert_one({
        "query": query,
        "name": name,
        "articles": articles,
        "sentiment": sentiment, 
        "gnews": news_results,
        "code": 201,
        "length": len(articles),
        "api": "SERP + newspaper",
        "success": True,
        "id": mongo.db.articles.count_documents({}) + 1,
        "date": datetime.now()
    })

    return jsonify({
        "gnews": news_results,
        "articles": articles,
        "sentiment": sentiment,
        "code": 201,
        "success": True
    })


@app.route("/search-sync/<query>")
def search(query):
    args = request.args
    print(query)
    llist = query.split('+')
    for i in range(len(llist)):
        llist[i] = llist[i][0].upper() + llist[i][1:]
    name = ' '.join(llist)

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
    articles, sentiment = sentiment_analysis(name, articles)

    mongo.db.articles.insert_one({
        "query": query,
        "name": name,
        "articles": articles, 
        "sentiment": sentiment,
        "length": len(articles),
        "gnews": news_response.json(),
        "code": article_response.status_code,
        "api": "APIFY",
        "success": True,
        "id": mongo.db.articles.count_documents({}) + 1,
        "date": datetime.now()
    })

    return jsonify({
        "gnews": news_response.json(),
        "articles": articles,
        "sentiment": sentiment,
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

@app.route("/history")
def history():
    args = request.args
    history = mongo.db.articles.find({}).sort("date", -1)

    responseData = []
    for each in history:
        responseData.append({
            "query": each["query"],
            "articles": each["articles"],
            "gnews": each["gnews"],
            "code": each["code"],
            "success": each["success"],
            "name": each["name"],
            "date": each["date"].strftime("%d/%m/%Y"),
            "api": each["api"],
            "sentiment": each["sentiment"],
            "length": each["length"]

        })

    return jsonify({
        "history": responseData,
        "success": True
    })