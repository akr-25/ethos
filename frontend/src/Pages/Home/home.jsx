import axios from "axios";
import React, { useMemo } from "react";
import { useRef, useState, useEffect } from "react";
import Table, {
  AvatarCell,
  dateCell,
  imageCell,
  linkCell,
  sourceCell,
  titleCell,
} from "../../Components/Table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import sampleNews from "../../sample/gnews100.json";
import sampleArticles from "../../sample/dawood_with_sentiment.json";
import "./style.css";
import * as ss from "simple-statistics";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const stateEnum = useMemo(() => {
    return {
      Home: 0,
      Loading: 1,
      NewsResults: 2,
      ArticleResults: 3,
      Error: 4,
    };
  }, []);

  const tabsEnum = useMemo(() => {
    return {
      Overview: 0,
      Graph: 1,
      MostPositive: 2,
      MostNegative: 3,
    };
  }, []);

  const [query, setQuery] = useState(null);
  const [numberOfArticles, setNumberOfArticles] = useState(20);
  const [gnews, setGnews] = useState();
  const [articles, setArticles] = useState();
  const [state, setState] = useState(stateEnum.Home);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(100);
  const [articleNumber, setArticleNumber] = useState(0);
  const [selectedTab, setSelectedTab] = useState(tabsEnum.Overview);

  const options = [5, 10, 20, 50, 100, 200];

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (
        estimatedTimeRemaining > 0 &&
        (state === stateEnum.Loading || state === stateEnum.NewsResults)
      ) {
        setEstimatedTimeRemaining(
          (estimatedTimeRemaining) => estimatedTimeRemaining - 1
        );
      }
    }, 1000);

    return () => {
      clearInterval(myInterval);
    };
  }, [estimatedTimeRemaining, state, stateEnum]);

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "index",
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: imageCell,
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: titleCell,
      },
      {
        Header: "Source",
        accessor: "source",
        Cell: sourceCell,
      },
      {
        Header: "Link",
        accessor: "link",
        Cell: linkCell,
      },
      {
        Header: "Published At",
        accessor: "publishedAt",
        Cell: dateCell,
      },
    ],
    []
  );

  const gnewsColumnsMobile = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        Cell: AvatarCell,
        imgAccessor: "image",
        emailAccessor: "source",
      },
      {
        Header: "Link",
        accessor: "link",
        Cell: linkCell,
      },
    ],
    []
  );

  const gnewsData = useMemo(() => {
    if (!gnews) return null;
    return gnews.map((news, index) => {
      return { ...news, index: index + 1 };
    });
  }, [gnews]);

  const articleData = useMemo(() => {
    if (!articles) return null;
    for (let i = 0; i < articles.length; i++) {
      let mostPositive = "";
      let mostPosValue = -1;
      let mostNegative = "";
      let mostNegValue = 1;
      articles[i]["paragraphs"].forEach((paragraph) => {
        paragraph.forEach((sentence) => {
          if (
            sentence.sentiment > mostPosValue &&
            sentence.text.trim() !== ""
          ) {
            mostPositive = sentence.text;
            mostPosValue = sentence.sentiment;
          }
          if (
            sentence.sentiment < mostNegValue &&
            sentence.text.trim() !== ""
          ) {
            mostNegative = sentence.text;
            mostNegValue = sentence.sentiment;
          }
        });
      });
      articles[i].mostPositive = mostPositive;
      articles[i].mostNegative = mostNegative;
    }

    // Sorting the articles by absolute sentiment
    articles.sort((a, b) => {
      return Math.abs(b.sentiment) - Math.abs(a.sentiment);
    });

    return articles.map((news, index) => {
      return { ...news, index: index + 1 };
    });
  }, [articles]);

  const barGraphData = useMemo(() => {
    if (!articles) return null;
    let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((value, index) => {
      return {
        name: (index - 5) / 5,
        uv: 0,
      };
    });
    for (let i = 0; i < articles.length; i++) {
      let sentiment = articles[i].sentiment;
      let index = Math.floor((sentiment + 1) * 5);
      data[index].uv += 1;
    }
    console.log(data);
    return data;
  }, [articles]);

  const mostNegativeData = useMemo(() => {
    if (!articles) return null;
    let data = articles;

    let sentences = [];
    for (let i = 0; i < data.length; i++) {
      let article = data[i];
      for (let j = 0; j < article.paragraphs.length; j++) {
        let paragraph = article.paragraphs[j];
        for (let k = 0; k < paragraph.length; k++) {
          let sentence = paragraph[k];
          if (sentence.text.trim() !== "") {
            sentences.push(sentence);
          }
        }
      }
    }

    sentences = sentences
      .sort((a, b) => a.sentiment - b.sentiment)
      .slice(0, 10);

    return sentences;
  }, [articles]);

  const sentimentScores = useMemo(() => {
    if (!articles) return null;

    let scores = [];
    articles.forEach((article) => {
      scores.push(article.sentiment);
    });

    scores.sort((a, b) => a - b);

    return scores;
  }, [articles]);

  const mostPositiveData = useMemo(() => {
    if (!articles) return null;
    let data = articles;

    let sentences = [];
    for (let i = 0; i < data.length; i++) {
      let article = data[i];
      for (let j = 0; j < article.paragraphs.length; j++) {
        let paragraph = article.paragraphs[j];
        for (let k = 0; k < paragraph.length; k++) {
          let sentence = paragraph[k];
          if (sentence.text.trim() !== "") {
            sentences.push({
              sentiment: sentence.sentiment,
              text: sentence.text,
            });
          }
        }
      }
    }

    sentences = sentences
      .sort((a, b) => b.sentiment - a.sentiment)
      .slice(0, 10);

    return sentences;
  }, [articles]);

  const changeArticleNumber = (isNext) => {
    if (isNext && articleNumber < articleData.length - 1) {
      setArticleNumber((articleNumber) => articleNumber + 1);
    } else if (!isNext && articleNumber > 0) {
      setArticleNumber((articleNumber) => articleNumber - 1);
    }
  };

  const predict = async (e) => {
    e.preventDefault();
    console.log(query);
    if (query) {
      setState(stateEnum.Loading);
      setEstimatedTimeRemaining(150);
      // getGnewsData();
      getArticleData();
    }
  };

  const getGnewsData = async () => {
    try {
      const params = new URLSearchParams([["num", numberOfArticles || 20]]);
      const response = await axios.get(
        `${BACKEND_URL}/search-sync-gnews/` + query,
        {
          params,
        }
      );
      console.log(response.data);
      if (
        response.data &&
        response.data["code"] &&
        response.data["code"] !== 200 &&
        response.data["code"] !== 201
      ) {
        setState(stateEnum.Error);
      }
      if (state === stateEnum.Loading) {
        setGnews(response.data["gnews"]);
        setState(stateEnum.NewsResults);
      }
    } catch (err) {
      setState(stateEnum.Error);
    }
  };

  const getArticleData = async (e) => {
    try {
      const params = new URLSearchParams([["num", numberOfArticles || 20]]);
      const response = await axios.get(
        `${BACKEND_URL}/search-sync/` + query,
        {
          params,
        }
      );
      console.log(response.data);
      if (
        response.data &&
        response.data["code"] &&
        response.data["code"] !== 200 &&
        response.data["code"] !== 201
      ) {
        setState(stateEnum.Error);
      }
      setArticles(response.data["articles"]);
      setGnews(response.data["gnews"]);
      setState(stateEnum.ArticleResults);
    } catch (err) {
      setState(stateEnum.Error);
    }
  };

  return (
    <div className='flex-1 flex flex-col bg-gray-100'>
      {state === stateEnum.Home && (
        <div className='max-w-7xl mx-auto px-8 py-10 mt-32'>
          <h1 className='text-4xl text-center'>
            {" "}
            News Article Sentiment Analysis{" "}
          </h1>
          <br></br>
          <br></br>

          <form>
            <label
              htmlFor='default-search'
              className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
            >
              Search
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <svg
                  aria-hidden='true'
                  className='w-5 h-5 text-gray-500 dark:text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
              <input
                type='search'
                id='default-search'
                className='block w-full p-6 pl-10 text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='e.g. Ryan Goshlings'
                required
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              <button
                className='text-white absolute right-2.5 bottom-[1.35rem] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                type='submit'
                onClick={(e) => predict(e)}
              >
                Search
              </button>
            </div>
            {/* Horizontal buttons to select the option from options array */}
            <div className='flex items-center justify-center p-2 m-2'>
              <p>Number of articles to display:</p>
              {options.map((option, index) => (
                <button
                  key={index}
                  type='button'
                  className={`text-white ${
                    numberOfArticles !== option
                      ? "bg-blue-400 dark:bg-blue-400"
                      : "bg-blue-600 dark:bg-blue-600"
                  } hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2  m-2  dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                  onClick={() => {
                    setNumberOfArticles(option);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </form>
        </div>
      )}
      {/* Round arrow Back Button on the top below navbar if the state is not 0*/}
      {state !== stateEnum.Home && (
        <div className='xl:block hidden absolute top-20 left-20 m-4'>
          <button
            className='text-white focus:ring-4 focus:outline-none shadow-lg hover:bg-slate-50 focus:ring-blue-300 font-medium rounded-full text-sm p-4 '
            onClick={() => {
              setState(0);
            }}
          >
            {/* Blue color */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-blue-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
          </button>
        </div>
      )}

      {/* Loading State with estimated remaining time*/}
      {state === stateEnum.Loading && (
        <div className='flex flex-col items-center justify-center flex-1  mb-20'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 m-4'></div>
          <h1 className='text-4xl text-center'>
            {estimatedTimeRemaining === 0
              ? "Please wait...\nIt's taking longer than expected"
              : `Estimated Waiting Time ${estimatedTimeRemaining}s`}
          </h1>
        </div>
      )}

      {/* Loading for article */}
      {state === stateEnum.NewsResults && (
        <div className='flex flex-col items-center justify-center flex-1  mb-20'>
          <div className='animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900 m-4'></div>
          <h1 className='text-2xl text-center'>
            {estimatedTimeRemaining === 0
              ? "Please wait...\nIt's taking longer than expected"
              : `Loading Articles...Estimated Waiting Time ${estimatedTimeRemaining}s`}
          </h1>
        </div>
      )}
      {/* Article Result State */}
      {state === stateEnum.ArticleResults && (
        <>
          <div className='text-gray-900 flex items-center justify-center flex-1 my-20 flex-col'>
            <div className='shadow-lg rounded-md flex-1 text-3xl max-w-5xl text-center w-full bg-white relative'>
              <p className='p-2 my-2'>Summary</p>
              <div className='grid grid-cols-12 border-t-4'>
                <div className='col-span-2 flex flex-col'>
                  {[
                    "Overview",
                    "Graph",
                    "Most Positive Sentences",
                    "Most Negative Sentences",
                  ].map((item, index) => (
                    <button
                      key={index}
                      type='button'
                      className={`text-white ${
                        selectedTab !== index ? "bg-slate-50" : "bg-slate-200"
                      } hover:bg-slate-700 border focus:outline-none font-medium text-sm px-4 py-2 text-black`}
                      onClick={() => {
                        setSelectedTab(index);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className='col-span-10 text-base'>
                  {selectedTab === tabsEnum.Graph && (
                    <div className='p-8'>
                      <BarChart width={700} height={400} data={barGraphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey='uv' fill='#8884d8' />
                      </BarChart>
                      <p className='text-center'>
                        Frequency Graph of sentiment scores
                      </p>
                    </div>
                  )}
                  {selectedTab === tabsEnum.MostNegative && (
                    <div className='p-8'>
                      <p className='text-center'>Most Negative Sentences</p>
                      <div className='grid grid-cols-2'>
                        {mostNegativeData.map((sentence, index) => (
                          <div key={index} className='p-4 border-2'>
                            <p className='text-center'>{sentence.text}</p>
                            <br></br>
                            <p className='text-center bg-slate-100 rounded-full'>
                              Sentiment Score: {sentence.sentiment.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedTab === tabsEnum.MostPositive && (
                    <div className='p-8'>
                      <p className='text-center'>Most Positive Sentences</p>
                      <div className='grid grid-cols-2'>
                        {mostPositiveData.map((sentence, index) => (
                          <div key={index} className='p-4 border-2'>
                            <p className='text-center'>{sentence.text}</p>
                            <br></br>
                            <p className='text-center bg-slate-100 rounded-full'>
                              Sentiment Score: {sentence.sentiment.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedTab === tabsEnum.Overview && (
                    <div className='p-8'>
                      <p className='text-center'>Overview</p>
                      <div className='grid grid-cols-2'>
                        <div className='p-4 border-2'>
                          <p className='text-center'>Average Sentiment Score</p>
                          <p className='text-center bg-slate-100 rounded-full'>
                            {ss.mean(sentimentScores).toFixed(2)}
                          </p>
                          {/* Median Sentiment Score */}
                          <p className='text-center'>Median Sentiment Score</p>
                          <p className='text-center bg-slate-100 rounded-full'>
                            {ss.median(sentimentScores).toFixed(2)}
                          </p>
                          {/* Variance Sentiment Score */}
                          <p className='text-center'>
                            Variance of Sentiment Score
                          </p>
                          <p className='text-center bg-slate-100 rounded-full'>
                            {ss.variance(sentimentScores).toFixed(2)}
                          </p>
                          {/* Standard Deviation Sentiment Score */}
                          <p className='text-center'>
                            Standard Deviation of Sentiment Score
                          </p>
                          <p className='text-center bg-slate-100 rounded-full'>
                            {ss.standardDeviation(sentimentScores).toFixed(2)}
                          </p>

                          {/* Mode Sentiment Score */}
                          <p className='text-center'>Mode of Sentiment Score</p>
                          <p className='text-center bg-slate-100 rounded-full'>
                            {ss.mode(sentimentScores).toFixed(2)}
                          </p>
                        </div>
                        <div className='p-4 border-2'>
                          {/* Good Neutral Bad Person based on avg sentiment */}
                          <p className='text-center'>
                            Nature of Person
                          </p>
                          <p className='text-center bg-slate-100 rounded-full'>
                            {ss.mode(sentimentScores) > 0.1
                              ? "Good"
                              : ss.mode(sentimentScores) < -0.1
                              ? "Bad"
                              : "Neutral"}
                          </p>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='text-gray-900 flex items-center justify-center flex-1 my-20 flex-col'>
            <div className='shadow-lg rounded-md pb-4 flex-1 text-3xl max-w-5xl text-center w-full bg-white relative'>
              <p className='p-6 border-b-4'>Article Sentiment Analysis</p>
              {/* Article Number absolute */}
              <div className='absolute top-0 right-0 m-4'>
                <p className='text-2xl'>
                  {articleNumber + 1}/{articleData.length}
                </p>
              </div>
              {/* Article */}
              <div className='grid grid-cols-4 m-4'>
                <div className='col-span-1 flex justify-center items-start mx-4 mb-4 rounded-sm'>
                  <img
                    src={articleData[articleNumber].image}
                    alt=''
                    className='rounded-3xl'
                  />
                </div>
                <div className='col-span-3 flex flex-col items-start justify-start mx-3 mt-2'>
                  <h1 className='text-2xl mb-4 text-left'>
                    {articleData[articleNumber].title}
                  </h1>
                  <p className='text-sm mb-2'>
                    {articleData[articleNumber].publisher}
                  </p>
                  <a
                    href={articleData[articleNumber].loadedUrl}
                    className='text-base text-left text-blue-600 hover:text-blue-700 overflow-ellipsis overflow-hidden'
                  >
                    {articleData[articleNumber].loadedUrl.substring(0, 50)}
                    {articleData[articleNumber].loadedUrl.length > 50 && "..."}
                  </a>
                </div>
              </div>
              <div className='grid grid-cols-2 m-4 h-min'>
                <div className='col-span-1 border rounded-md max-h-60 text-sm'>
                  <div className='text overflow-y-scroll p-4 max-h-60 text-justify'>
                    {articleData[articleNumber]["paragraphs"].map(
                      (para, paraIndex) => (
                        <div key={paraIndex}>
                          {para.map((sentence, index) => (
                            <span
                              key={index + paraIndex * 1000}
                              className={`
                        ${sentence.sentiment > 0.5 && "bg-green-500"}
                        ${sentence.sentiment < -0.5 && "bg-red-500"}
                        `}
                            >
                              {sentence["text"]}.{" "}
                            </span>
                          ))}
                          <br></br>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className='col-span-1 flex flex-col text-left justify-around mx-4 h-min'>
                  <p className='font-semibold text-sm mb-4'>
                    MOST POSITIVE SENTENCE-{" "}
                    <span className='text-sm font-normal'>
                      {articleData[articleNumber]["mostPositive"]}
                    </span>
                  </p>
                  <p className='font-semibold text-sm text-left mb-4'>
                    MOST NEGATIVE SENTENCE-{" "}
                    <span className='text-sm font-normal'>
                      {articleData[articleNumber]["mostNegative"]}
                    </span>
                  </p>

                  <label
                    htmlFor='default-range'
                    className='block mb-2 text-sm font-semibold text-gray-900 dark:text-white'
                  >
                    SENTIMENT
                  </label>
                  <input
                    id='default-range'
                    type='range'
                    value={articleData[articleNumber]["sentiment"] * 50 + 50}
                    className='w-full h-2 bg-gradient-to-r from-red-500 to-green-500 rounded-lg appearance-none'
                    disabled
                  />
                  <div className='flex'>
                    <div className='flex-1 text-left text-xs text-gray-500'>
                      Negative
                    </div>
                    <div className='flex-1 text-right text-xs text-gray-500'>
                      Positive
                    </div>
                  </div>
                </div>
              </div>
              {/* Prev and Next button on cornors */}
              <div className='flex justify-between w-full'>
                <div className={` ${0 !== articleNumber ? "hidden" : "block"}`}>
                  {" "}
                </div>
                <div className={` ${0 === articleNumber ? "hidden" : "block"}`}>
                  <button
                    className='flex m-4 items-center'
                    onClick={() => {
                      changeArticleNumber(0);
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 19l-7-7 7-7'
                      />
                    </svg>
                    <span className='text-base'>Previous</span>
                  </button>
                </div>
                <div
                  className={` ${
                    articleData.length - 1 === articleNumber
                      ? "hidden"
                      : "block"
                  }`}
                >
                  <button
                    className='flex m-4'
                    onClick={() => {
                      changeArticleNumber(1);
                    }}
                  >
                    <span className='text-base'>Next</span>

                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* News Result State */}
      {(state === stateEnum.NewsResults ||
        state === stateEnum.ArticleResults) && (
        <div className='text-gray-900 flex items-center justify-center flex-1 my-20 flex-col'>
          <div className='shadow-lg rounded-md pb-4 flex-1 text-3xl max-w-5xl text-center w-full bg-white relative'>
            <p className='p-8 border-b-4'>Google News Search Result</p>
            <main className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-base'>
              <div className='mt-6 md:hidden block'>
                <Table columns={gnewsColumnsMobile} data={gnewsData} />
              </div>
              <div className='mt-6 hidden md:block'>
                <Table columns={columns} data={gnewsData} />
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Error State */}
      {state === stateEnum.Error && (
        <div className='text-gray-900 flex items-center justify-center flex-1'>
          <main className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 bg-white shadow-lg m-12 rounded-md'>
            <div className='text-3xl text-center'>
              {" "}
              Error Occured, Please Try Again{" "}
              <button
                className='flex m-4'
                onClick={() => {
                  setState(stateEnum.Home);
                }}
              >
                <span className='text-base'>Go Back</span>
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default Home;
