import React, { useMemo, useState, useEffect } from "react";
import sampleData from "../../sample/sample_with_sentiment.json";
import Table, {
  AvatarCell,
  dateCell,
  imageCell,
  linkCell,
  sourceCell,
  titleCell,
  queryCell,
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
import * as ss from "simple-statistics";
import axios from "axios";
import { REACT_APP_BACKEND_URL as BACKEND_URL } from "../../config/url";

const History = () => {
  const [fetchedData, setFetchedData] = useState(null);

  const data = useMemo(() => {
    if (!fetchedData) return null;
    return fetchedData["history"].map((news, index) => {
      // let sentiment = news["sentiment"];
      return { ...news, index: index, id: index + 1 };
    });
  }, [fetchedData]);
  console.log(data);

  const stateEnum = useMemo(() => {
    return {
      History: 0,
      View: 1,
      Error: 2,
    };
  }, []);

  const [state, setState] = useState(stateEnum.History);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    console.log("History");
    const fetchData = async () => {
      try {
        const result = await axios.get(`${BACKEND_URL}/history`);
        setFetchedData(result.data);
      } catch (error) {
        setState(stateEnum.Error);
      }
    };
    fetchData();
  }, [stateEnum]);

  const gnewsData = useMemo(() => {
    if (selected === -1 || !data[selected]["gnews"]) return null;
    return data[selected]["gnews"].map((news, index) => {
      return { ...news, index: index + 1 };
    });
  }, [data, selected]);

  const tabsEnum = useMemo(() => {
    return {
      Overview: 0,
      Graph: 1,
      MostPositive: 2,
      MostNegative: 3,
    };
  }, []);

  const [articleNumber, setArticleNumber] = useState(0);
  const [selectedTab, setSelectedTab] = useState(tabsEnum.Overview);

  // const imageAccessor = useMemo(() => {
  //   if (selected === -1) return "image";
  //   return data[selected]["api"] === "APIFY" ? "image" : "thumbnail";
  // }, [data, selected]);

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "index",
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

  const articleData = useMemo(() => {
    if (selected === -1) return null;
    for (let i = 0; i < data[selected]["articles"].length; i++) {
      let mostPositive = "";
      let mostPosValue = -1;
      let mostNegative = "";
      let mostNegValue = 1;
      data[selected]["articles"][i]["paragraphs"].forEach((paragraph) => {
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
      data[selected]["articles"][i].mostPositive = mostPositive;
      data[selected]["articles"][i].mostNegative = mostNegative;
    }

    // Sorting the data[selected]["articles"] by absolute sentiment
    data[selected]["articles"].sort((a, b) => {
      return Math.abs(b.sentiment) - Math.abs(a.sentiment);
    });

    return data[selected]["articles"].map((news, index) => {
      return { ...news, index: index + 1 };
    });
  }, [data, selected]);

  const barGraphData = useMemo(() => {
    if (selected === -1) return null;
    let data2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((value, index) => {
      return {
        name: (index - 5) / 5,
        uv: 0,
      };
    });
    for (let i = 0; i < data[selected]["articles"].length; i++) {
      let sentiment = data[selected]["articles"][i].sentiment;
      let index = Math.floor((sentiment + 1) * 5);
      data2[index].uv += 1;
    }
    console.log(data2);
    return data2;
  }, [data, selected]);

  const mostNegativeData = useMemo(() => {
    if (selected === -1) return null;
    let data2 = data[selected]["articles"];

    let sentences = [];
    for (let i = 0; i < data2.length; i++) {
      let article = data2[i];
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
  }, [data, selected]);

  const sentimentScores = useMemo(() => {
    if (selected === -1) return null;

    let scores = [];
    data[selected]["articles"].forEach((article) => {
      scores.push(article.sentiment);
    });

    scores.sort((a, b) => a - b);

    return scores;
  }, [data, selected]);
  console.log(sentimentScores);

  const mostPositiveData = useMemo(() => {
    if (selected === -1) return null;
    let data2 = data[selected]["articles"];

    let sentences = [];
    for (let i = 0; i < data2.length; i++) {
      let article = data2[i];
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
  }, [selected, data]);

  const changeArticleNumber = (isNext) => {
    if (isNext && articleNumber < articleData.length - 1) {
      setArticleNumber((articleNumber) => articleNumber + 1);
    } else if (!isNext && articleNumber > 0) {
      setArticleNumber((articleNumber) => articleNumber - 1);
    }
  };

  const historyColumn = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Query",
        accessor: "name",
      },
      // {
      //   Header: "Person Behaviour",
      //   accessor: "person",
      // },
      {
        Header: "Score",
        accessor: "sentiment",
        Cell: ({ value }) => (
          <div
            className={`${
              value > 0 ? "text-green-500" : "text-red-500"
            } text-white font-bold text-left`}
          >
            {value.toFixed(2)}
          </div>
        ),
      },
      {
        Header: "Number of Articles",
        accessor: "length",
      },
      {
        Header: "API Used",
        accessor: "api",
      },
      {
        Header: "Date",
        accessor: "date"
      },
      {
        Header: "View",
        accessor: "index",
        Cell: ({ value }) => (
          <div className='flex  justify-center'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => {
                setSelected(value);
                setState(stateEnum.View);
              }}
            >
              Click to Open
            </button>
          </div>
        ),
      },
    ],

    [stateEnum]
  );

  return (
    <>
      {/* Round arrow Back Button on the top below navbar if the state is not 0*/}
      {state !== stateEnum.History && (
        <div className='xl:block hidden absolute top-20 left-20 m-4'>
          <button
            className='text-white focus:ring-4 focus:outline-none shadow-lg hover:bg-slate-50 focus:ring-blue-300 font-medium rounded-full text-sm p-4 '
            onClick={() => {
              setState(stateEnum.History);
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

      {state === stateEnum.History && (
        <div className='text-gray-900 flex items-center justify-center flex-1 my-20 flex-col mx-20'>
          <div className='shadow-lg rounded-md pb-4 flex-1 text-3xl max-w-5xl w-full bg-white relative'>
            <p className='p-8 border-b-4 text-center'>History</p>
            <main className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-base'>
              <div className='mt-6'>
                {(!data || (data && data.length === 0)) && (
                  <div className='text-center'>
                    <p className='text-2xl'>No History Found</p>
                  </div>
                )}
                {data && data.length > 0 && (
                  <Table columns={historyColumn} data={data} />
                )}
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
                  setState(stateEnum.History);
                }}
              >
                <span className='text-base'>Go Back</span>
              </button>
            </div>
          </main>
        </div>
      )}

      {state === stateEnum.View && (
        <>
          <div className='text-gray-900 flex items-center justify-center flex-1 my-20 flex-col'>
            <p className='mt-4 text-5xl mb-8'>Query: {data[selected].name}</p>
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
                          <p className='text-center'>Nature of Person</p>
                          <p className='text-center bg-slate-100 rounded-full'>
                            {data[selected].sentiment > 0.1
                              ? "Good"
                              : data[selected].sentiment < -0.1
                              ? "Bad"
                              : "Neutral"}
                          </p>
                          <p className='text-center'>
                            Sentiment generated by concatinating relevant
                            passages
                          </p>
                          <p className='text-center bg-slate-100 rounded-full'>
                            {data[selected].sentiment.toFixed(2)}
                          </p>
                          <p className='text-center p-8 mt-3 rounded-full text-[5rem]'>
                            {data[selected].sentiment > 0.1
                              ? "😀"
                              : data[selected].sentiment < -0.1
                              ? "😞"
                              : "😐"}
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
                        ${
                          sentence.sentiment >
                            ss.quantile(sentimentScores, 0.8) && "bg-green-500"
                        }
                        ${
                          sentence.sentiment <
                            ss.quantile(sentimentScores, 0.2) && "bg-red-500"
                        }
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
        </>
      )}
    </>
  );
};

export default History;
