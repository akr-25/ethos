const fs = require('fs');
const articles = require('./ryan200.json');
const textFromJsonExtractor = () => {
  let text = articles['articles'].map((article, index) => {
    return {
      "text": article.text,
      "index": index
    }
  });
  text = JSON.stringify(text);
  // Save to a file
  fs.writeFile('ryan.json', text, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

textFromJsonExtractor();