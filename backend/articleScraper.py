from newspaper import Article
import asyncio

async def scrapeArticle(url, news, articles):
    article = Article(url)
    article.download()
    article.parse()
    # article.nlp()
    articles.append({
        'title': article.title,
        'text': article.text,
        # 'summary': article.summary,
        # 'keywords': article.keywords,
        'authors': article.authors,
        'publish_date': article.publish_date,
        'image': article.top_image,
        'url': url,
        'loadedUrl': url,
        "publisher": news["source"],
    })
