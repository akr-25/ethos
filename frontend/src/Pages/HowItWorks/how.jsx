import React from "react";

const How = () => {
  return (
    <div className='w-full flex-1 flex justify-center items-center min-h-full'>
      <div className='flex flex-col items-center justify-center m-8 p-8 bg-white rounded-lg shadow-md max-w-5xl'>
        <div className='w-full text-left px-12'>
          <h1 className='font-bold text-4xl mb-6'>How to use?</h1>
          <ul className=''>
            <li className='font-semibold'>
              Step 1:{" "}
              <span className='font-normal'>
                Enter the name of the person in interest in the search bar and
                select the max number of articles and the api Method preferred.
              </span>
            </li>
            <li className='font-semibold'>
              Step 2:{" "}
              <span className='font-normal'>
                Click on the search button and wait for the results to be
                displayed. Tip: For fast results, select `SERP API + newspaper`
                as the api method, and for more accurate results, select
                `APIFY`.
              </span>
            </li>
            <li className='font-semibold'>
              Step 3:{" "}
              <span className='font-normal'>
                Summary of the articles will be displayed along with individual
                article sentiment analysis.
              </span>
            </li>
            <li className='font-semibold'>
              Step 4:{" "}
              <span className='font-normal'>
                Click on the `History Tab` to view the search history.
              </span>
            </li>
          </ul>
        </div>
        <div className='w-full text-left px-12'>
          <h1 className='text-4xl mt-12 mb-8 font-bold'> How it works? </h1>
          <ul>
            <li className='font-semibold'>
              Step 1:{" "}
              <span className='font-normal'>
                The search bar uses the Google Search API (APIFY or SERPAPI) to
                fetch the results for the given query.
              </span>
            </li>
            <li className='font-semibold'>
              Step 2:{" "}
              <span className='font-normal'>
                The results are then passed to the newspaper library to extract
                the article text or to APIFY API depending on the api method
                used.
              </span>
            </li>
            <li className='font-semibold'>
              Step 3:{" "}
              <span className='font-normal'>
                Text is divided into sentences using spacy nlp library and then sentences are filtered based on
                the given query(eg. Donald Trump). For sentiment analysis, spacy
                textblob library is used on individual sentences and also on concatinated filtered sentences.
              </span>
            </li>
            <li className='font-semibold'>
              Step 4:{" "}
              <span className='font-normal'>
                The results are then displayed beautifully using react with help of graphs, tables and metrics.
              </span>
            </li>
            <li className='font-semibold'>
              Step 5:{" "}
              <span className='font-normal'>
                All the results are stored in the database and can be viewed in the history tab.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default How;
