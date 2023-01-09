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
    news_articles = ["" for i in range(df.shape[0])]

    #Split articles into paras
    df.text = df.text.str.split('\n\n')
    # print(df.text.loc[0])

    #traverse all articles
    for i in range(0, df.shape[0]):
        x = len(df['text'].loc[i])

        ##paras into sentences
        lst = []
        for j in range(0, x):
            curr = nlp(df['text'].loc[i][j])
            curr_lst = [str(sent) for sent in curr.sents]
            # print("PARA: ",  curr_lst, " SIZE: ", len(curr_lst))
            lst.append(curr_lst)

        df['text'].loc[i] = lst
        # print(lst)


    #filter sentences using this word
    first_name = (name.split(' '))[0].lower()
    # # print(first_name)

    whole_search_text = ""
    #sentiment of each sentence
    sentiment_article = []
    for i in range(0, df.shape[0]):

        sentiment_para = []
        for j in range(len(df.text.loc[i])):
            sentiment_line = []
            # print(df.text.loc[i][j])

            for k in range(len(df.text[i][j])):
                # print(df.text[i][j][k])
                split_sentence = (df.text[i][j][k]).split(' ')
                split_sentence = [word.lower() for word in split_sentence]
                
                if first_name in split_sentence:
                    # print(df.text[i][j][k])
                    value = nlp(df.text[i][j][k])._.blob.polarity
                    sentiment_line.append(value)
                    news_articles[i] += df.text[i][j][k]
                    whole_search_text += df.text[i][j][k]

                else:
                    sentiment_line.append(0)
                    
                # print(df.text[i][j][k], " ", sentiment_line[k])

            sentiment_para.append(sentiment_line)
        sentiment_article.append(sentiment_para)
        # print(news_articles[i])

    #overall sentiment
    overall_sentiment = []
    for i in range(len(news_articles)):
        value = nlp(news_articles[i])._.blob.polarity
        overall_sentiment.append(value)

    sentiment_person = nlp(whole_search_text)._.blob.polarity

    #final result
    for i in range(len(news_articles)):
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
        # print(articles[i]["paragraphs"])
    
    return articles, sentiment_person
# f = json.load(open("ryan200.json"))
# name = "ryan"
# results = sentiment_analysis(name, f)
# with open('data.json', 'w') as f:
#     json.dump(results, f)

# # print(results)