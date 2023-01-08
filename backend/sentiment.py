import pandas as pd
import spacy
from spacytextblob.spacytextblob import SpacyTextBlob
import json

def sentiment_analysis(articles):
    #Load Model
    nlp = spacy.load('en_core_web_sm')
    nlp.add_pipe('spacytextblob')

    #Read Data
    df_raw = []
    for i in range(len(articles)):
        df_raw.append({
          "text": articles[i]["text"],
          "index": i
        })
    df_raw = json.dumps(df_raw)
    df = pd.read_json(df_raw)
    news_articles = df.text

    #Split articles into sentences
    df.text = df.text.str.split('\n\n')
    for i in range(0, df.shape[0]):
        x = len(df['text'].loc[i])

        lst = []
        for j in range(0, x):
            curr = (df['text'].loc[i][j]).split(".")
            lst.append(curr)

        df['text'].loc[i] = lst

    #sentiment of each sentence
    sentiment_article = []
    for i in range(len(df.text)):
        sentiment_para = []
        for j in range(len(df.text[i])):
            sentiment_line = []
            for k in range(len(df.text[i][j])):
                value = nlp(df.text[i][j][k])._.blob.polarity
                sentiment_line.append(value)
            sentiment_para.append(sentiment_line)
        sentiment_article.append(sentiment_para)

    #overall sentiment
    overall_sentiment = []
    for i in range(news_articles.shape[0]):
        value = nlp(news_articles.loc[i])._.blob.polarity
        overall_sentiment.append(value)

    for i in range(len(df.text)):
        articles[i]["sentiment"] = overall_sentiment[i]

        paras = []
        for j in range(len(df.text.loc[i])):
            sentences = []

            for k in range(len(df.text.loc[i][j])):
                sentiment = {}
                sentiment["sentiment"] = sentiment_article[i][j][k]
                sentiment["text"] = df.text.loc[i][j][k]
    
                sentences.append(sentiment)
    
            paras.append( sentences)
  
        articles[i]["paragraphs"] = paras
    
    return articles
