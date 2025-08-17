import axiosClient from "./axiosClient";
import axios from "axios";

// Create axios client for CNN API
const cnnApiClient = axios.create({
  baseURL: "/cnn-api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// NewsAPI.org - existing API
const getNews = async (keyword) => {
  try {
    const response = await axiosClient.get("/v2/everything", {
      params: {
        q: keyword,
        apiKey: import.meta.env.VITE_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("NewsAPI Error:", error);
    return null;
  }
};

// NewsData.io - new API
const getNewsFromNewsData = async (keyword, country = "id", language = "id") => {
  try {
    let url, params;
    
    if (keyword) {
      url = "https://newsdata.io/api/1/news";
      params = {
        apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
        q: keyword,
        country: country,
        language: language,
        size: 10
      };
    } else {
      url = "https://newsdata.io/api/1/latest";
      params = {
        apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
        country: country,
        language: language,
        size: 10
      };
    }

    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("NewsData API Error:", error);
    return null;
  }
};

// CNN News Indonesia - new API
const getCNNNews = async (category = "teknologi") => {
  try {
    const response = await cnnApiClient.get(`/api/cnn-news/${category}`);
    console.log("CNN News Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("CNN News API Error:", error);
    console.error("Error details:", error.response?.data || error.message);
    return null;
  }
};

// Fungsi gabungan untuk mengambil berita dari semua API
const getAllNews = async (keyword) => {
  try {
    const [newsApiData, newsDataResult, cnnNewsData] = await Promise.allSettled([
      getNews(keyword),
      getNewsFromNewsData(keyword),
      getCNNNews("teknologi")
    ]);

    let combinedArticles = [];
    
    // Format NewsAPI articles
    if (newsApiData.status === 'fulfilled' && newsApiData.value?.articles) {
      combinedArticles = [...combinedArticles, ...newsApiData.value.articles.map(article => ({
        ...article,
        apiSource: 'NewsAPI'
      }))];
    }
    
    // Format NewsData articles  
    if (newsDataResult.status === 'fulfilled' && newsDataResult.value?.results) {
      const formattedNewsData = newsDataResult.value.results.map(article => ({
        title: article.title,
        description: article.description || article.content,
        content: article.content,
        url: article.link,
        urlToImage: article.image_url,
        publishedAt: article.pubDate,
        source: { name: article.source_id || article.source_name },
        author: article.creator ? (Array.isArray(article.creator) ? article.creator.join(', ') : article.creator) : null,
        apiSource: 'NewsData'
      }));
      combinedArticles = [...combinedArticles, ...formattedNewsData];
    }

    // Format CNN News articles
    if (cnnNewsData.status === 'fulfilled' && cnnNewsData.value?.data) {
      const formattedCNNData = cnnNewsData.value.data.map(article => ({
        title: article.title,
        description: article.contentSnippet || article.description,
        content: article.contentSnippet,
        url: article.link,
        urlToImage: article.image?.large || article.image?.small || null,
        publishedAt: article.isoDate,
        source: { name: "CNN Indonesia" },
        author: null,
        apiSource: 'CNN Indonesia'
      }));
      combinedArticles = [...combinedArticles, ...formattedCNNData];
    }

    // Shuffle artikel untuk mencampur sumber
    combinedArticles = combinedArticles.sort(() => Math.random() - 0.5);

    return { articles: combinedArticles };
  } catch (error) {
    console.error("Combined API Error:", error);
    return { articles: [] };
  }
};

// Fungsi khusus untuk berita terbaru dari NewsData
const getLatestNewsData = async (country = "id", language = "id") => {
  try {
    const params = {
      apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
      country: country,
      language: language,
      size: 10
    };
    
    const response = await axios.get("https://newsdata.io/api/1/latest", { params });
    return response.data;
  } catch (error) {
    console.error("NewsData Latest API Error:", error);
    return null;
  }
};

export { getNews, getNewsFromNewsData, getAllNews, getLatestNewsData, getCNNNews };