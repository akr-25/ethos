import pandas as pd
import spacy
from spacytextblob.spacytextblob import SpacyTextBlob
import json

def sentiment_analysis(name, articles):
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
            curr = nlp(df['text'].loc[i][j])
            lst.append(curr)

        df['text'].loc[i] = lst


    first_name = [(name.split(' '))[0]]
    first_name.append(first_name[0].lower())
    #sentiment of each sentence
    sentiment_article = []
    for i in range(len(df.text)):
        news_articles[i] = ""

        sentiment_para = []
        for j in range(len(df.text[i])):
            sentiment_line = []
            for k in range(len(df.text[i][j])):
                split_sentence = (df.text[i][j][k].text).split(' ')

                a = 0
                for word in first_name:
                    if word in split_sentence:
                        a = 1
                        break
                    
                if (a == 1):
                    value = nlp(df.text[i][j][k].text)._.blob.polarity
                    sentiment_line.append(value)
                    news_articles[i] += f"{df.text[i][j][k].text}. "

                else:
                    sentiment_line.append(0)
                    
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
    
            paras.append(sentences)
  
        articles[i]["paragraphs"] = paras
    
    return articles

f = json.load(open("response200.json"))
name = "ryan"
results = sentiment_analysis(name, f["articles"][0:2])
print(results[0]["paragraphs"])