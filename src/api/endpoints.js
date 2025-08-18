import axiosClient from "./axiosClient";
import axios from "axios";

// Create axios client for NewsAPI with proper configuration
const newsApiClient = axios.create({
  baseURL: "/v2", // Sesuai dengan proxy di vite.config.js
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Create axios client for NewsData.io
const newsDataClient = axios.create({
  baseURL: "/newsdata", // Sesuai dengan proxy di vite.config.js
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Create axios client for CNN API
const cnnApiClient = axios.create({
  baseURL: "/cnn-api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// NewsAPI.org - dengan error handling yang lebih baik
const getNews = async (keyword) => {
  try {
    // Improve search terms for better results
    let searchQuery = keyword;
    
    // Map Indonesian terms to English for better NewsAPI results
    const termMapping = {
      'teknologi': 'technology OR tech OR gadget',
      'smartphone': 'smartphone OR mobile phone OR android OR iphone',
      'komputer': 'computer OR laptop OR PC',
      'internet': 'internet OR web OR online',
      'ai': 'artificial intelligence OR AI OR machine learning',
      'robot': 'robot OR robotics OR automation',
      'game': 'gaming OR video games OR esports',
      'aplikasi': 'app OR application OR software',
      'startup': 'startup OR tech company',
      'programming': 'programming OR coding OR developer',
      'cybersecurity': 'cybersecurity OR security OR hacking',
      'blockchain': 'blockchain OR cryptocurrency OR bitcoin',
      'cloud': 'cloud computing OR AWS OR Google Cloud',
      'data': 'big data OR data science OR analytics'
    };

    // Check if the keyword matches any mapping
    const lowerKeyword = keyword.toLowerCase();
    if (termMapping[lowerKeyword]) {
      searchQuery = termMapping[lowerKeyword];
    } else {
      // For other terms, use both English and original term
      searchQuery = `${keyword} OR technology OR tech`;
    }

    console.log('NewsAPI - Fetching with query:', searchQuery);
    
    const response = await newsApiClient.get("/everything", {
      params: {
        q: searchQuery,
        apiKey: import.meta.env.VITE_API_KEY,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 50,
        // Tambahkan parameter untuk menghindari artikel yang dihapus
        excludeDomains: 'removed.com'
      },
    });

    console.log('NewsAPI Response:', response.data);
    return response.data;
  } catch (error) {
    console.error("NewsAPI Error:", error.response?.data || error.message);
    
    // Fallback jika ada masalah dengan proxy, coba direct call
    try {
      console.log('NewsAPI - Trying direct call...');
      const fallbackResponse = await axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: searchQuery,
          apiKey: import.meta.env.VITE_API_KEY,
          language: 'en',
          sortBy: 'relevancy',
          pageSize: 50,
        },
      });
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error("NewsAPI Fallback Error:", fallbackError.response?.data || fallbackError.message);
      return { articles: [] };
    }
  }
};

// NewsData.io - dengan perbaikan
const getNewsFromNewsData = async (keyword, country = "id", language = "id") => {
  try {
    let endpoint, params;
    
    // Perbaikan istilah pencarian untuk NewsData API
    let searchQuery = keyword;
    
    // Pemetaan istilah teknologi dalam bahasa Indonesia
    const indonesianTermMapping = {
      'teknologi': 'teknologi OR technology',
      'kecerdasan buatan': 'AI OR artificial intelligence OR kecerdasan buatan',
      'ponsel': 'smartphone OR ponsel OR handphone',
      'komputer': 'komputer OR laptop OR PC',
      'internet': 'internet OR web OR online',
      'robot': 'robot OR robotik',
      'permainan': 'game OR gaming OR permainan',
      'aplikasi': 'aplikasi OR software',
      'startup': 'startup OR perusahaan teknologi',
      'pemrograman': 'programming OR coding OR pemrograman',
      'keamanan siber': 'cybersecurity OR keamanan siber',
      'blockchain': 'blockchain OR cryptocurrency',
      'komputasi awan': 'cloud computing OR komputasi awan',
      'data': 'big data OR data science OR analitik data'
    };

    const lowerKeyword = keyword.toLowerCase();
    if (indonesianTermMapping[lowerKeyword]) {
      searchQuery = indonesianTermMapping[lowerKeyword];
    }
    
    // Gunakan parameter yang sesuai untuk konten Indonesia
    if (searchQuery && searchQuery !== 'teknologi') {
      endpoint = "/api/1/news";
      params = {
        apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
        q: searchQuery,
        language: 'id', // Gunakan Bahasa Indonesia
        country: 'id', // Fokus ke konten Indonesia
        size: 10
      };
    } else {
      endpoint = "/api/1/latest";
      params = {
        apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
        language: 'id',
        country: 'id',
        category: 'technology',
        size: 10
      };
    }

    console.log('NewsData - Mengambil data dengan:', endpoint, 'parameter:', params);
    
    const response = await newsDataClient.get(endpoint, { params });
    console.log('NewsData Response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Kesalahan NewsData API:", error.response?.data || error.message);
    
    // Coba panggilan langsung jika proxy gagal
    try {
      console.log('NewsData - Mencoba panggilan langsung...');
      const directUrl = keyword && keyword !== 'teknologi' 
        ? "https://newsdata.io/api/1/news"
        : "https://newsdata.io/api/1/latest";
      
      const fallbackParams = {
        apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
        language: 'id',
        country: 'id',
        ...(keyword && keyword !== 'teknologi' ? { q: keyword } : { category: 'technology' }),
        size: 10
      };
      
      const fallbackResponse = await axios.get(directUrl, { params: fallbackParams });
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error("Kesalahan Fallback NewsData:", fallbackError.response?.data || fallbackError.message);
      return { results: [] };
    }
  }
};

// CNN News Indonesia - dengan perbaikan filtering
const getCNNNews = async (category = "teknologi", searchTerm = null) => {
  try {
    console.log('CNN - Fetching category:', category, 'searchTerm:', searchTerm);
    
    const response = await cnnApiClient.get(`/api/cnn-news/${category}`);
    console.log("CNN News Response:", response.data);
    
    // Always return some articles, don't filter too strictly
    if (response.data?.data && Array.isArray(response.data.data)) {
      // If search term provided and it's not 'technology', filter results
      if (searchTerm && searchTerm !== 'technology') {
        const filteredData = response.data.data.filter(article => {
          const title = article.title?.toLowerCase() || '';
          const description = article.description?.toLowerCase() || '';
          const content = article.contentSnippet?.toLowerCase() || '';
          const searchLower = searchTerm.toLowerCase();
          
          return title.includes(searchLower) || 
                 description.includes(searchLower) || 
                 content.includes(searchLower);
        });
        
        // If filtered results exist, use them; otherwise return all
        return {
          ...response.data,
          data: filteredData.length > 0 ? filteredData : response.data.data.slice(0, 20)
        };
      }
      
      // Return first 20 articles for general 'technology' search
      return {
        ...response.data,
        data: response.data.data.slice(0, 20)
      };
    }
    
    return response.data;
  } catch (error) {
    console.error("CNN News API Error:", error.response?.data || error.message);
    
    // Fallback direct call
    try {
      console.log('CNN - Trying direct call...');
      const fallbackResponse = await axios.get(`https://berita-indo-api-next.vercel.app/api/cnn-news/${category}`);
      
      if (fallbackResponse.data?.data && Array.isArray(fallbackResponse.data.data)) {
        if (searchTerm && searchTerm !== 'technology') {
          const filteredData = fallbackResponse.data.data.filter(article => {
            const title = article.title?.toLowerCase() || '';
            const description = article.description?.toLowerCase() || '';
            const content = article.contentSnippet?.toLowerCase() || '';
            const searchLower = searchTerm.toLowerCase();
            
            return title.includes(searchLower) || 
                   description.includes(searchLower) || 
                   content.includes(searchLower);
          });
          
          return {
            ...fallbackResponse.data,
            data: filteredData.length > 0 ? filteredData : fallbackResponse.data.data.slice(0, 20)
          };
        }
        
        return {
          ...fallbackResponse.data,
          data: fallbackResponse.data.data.slice(0, 20)
        };
      }
      
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error("CNN Fallback Error:", fallbackError.response?.data || fallbackError.message);
      return { data: [] };
    }
  }
};

// Enhanced search function with better filtering
const searchInArticles = (articles, searchTerm) => {
  if (!searchTerm || !articles) return articles;
  
  const searchLower = searchTerm.toLowerCase();
  
  return articles.filter(article => {
    const title = article.title?.toLowerCase() || '';
    const description = article.description?.toLowerCase() || '';
    const content = article.content?.toLowerCase() || '';
    const source = article.source?.name?.toLowerCase() || '';
    
    return title.includes(searchLower) || 
           description.includes(searchLower) || 
           content.includes(searchLower) ||
           source.includes(searchLower);
  });
};

// Fungsi gabungan untuk mengambil berita dari semua API dengan error handling yang lebih baik
const getAllNews = async (keyword) => {
  try {
    console.log(`Searching for: ${keyword}`);
    
    // Jalankan semua API secara bersamaan dengan timeout yang tepat
    const apiCalls = await Promise.allSettled([
      Promise.race([
        getNews(keyword),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('NewsAPI timeout')), 10000)
        )
      ]),
      Promise.race([
        getNewsFromNewsData(keyword),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('NewsData timeout')), 10000)
        )
      ]),
      Promise.race([
        getCNNNews("teknologi", keyword),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('CNN timeout')), 10000)
        )
      ])
    ]);

    let combinedArticles = [];
    let successCount = 0;
    
    // Process NewsAPI articles
    if (apiCalls[0].status === 'fulfilled' && apiCalls[0].value?.articles) {
      let articles = apiCalls[0].value.articles;
      
      // Filter out removed articles
      articles = articles.filter(article => 
        article.title && 
        article.title !== '[Removed]' && 
        article.description &&
        article.description !== '[Removed]'
      );
      
      // Additional filtering for more relevant results
      if (keyword && keyword !== 'technology') {
        articles = searchInArticles(articles, keyword);
      }
      
      combinedArticles = [...combinedArticles, ...articles.map(article => ({
        ...article,
        apiSource: 'NewsAPI'
      }))];
      
      successCount++;
      console.log(`NewsAPI: ${articles.length} articles`);
    } else {
      console.log('NewsAPI failed:', apiCalls[0].reason?.message);
    }
    
    // Process NewsData articles  
    if (apiCalls[1].status === 'fulfilled' && apiCalls[1].value?.results) {
      let results = apiCalls[1].value.results;
      
      // Additional filtering for more relevant results
      if (keyword && keyword !== 'technology') {
        results = results.filter(article => {
          const title = article.title?.toLowerCase() || '';
          const description = article.description?.toLowerCase() || '';
          const content = article.content?.toLowerCase() || '';
          const searchLower = keyword.toLowerCase();
          
          return title.includes(searchLower) || 
                 description.includes(searchLower) || 
                 content.includes(searchLower);
        });
      }
      
      const formattedNewsData = results.map(article => ({
        title: article.title,
        description: article.description || article.content,
        content: article.content,
        url: article.link,
        urlToImage: article.image_url,
        publishedAt: article.pubDate,
        source: { name: article.source_id || article.source_name || 'NewsData' },
        author: article.creator ? (Array.isArray(article.creator) ? article.creator.join(', ') : article.creator) : null,
        apiSource: 'NewsData'
      }));
      
      combinedArticles = [...combinedArticles, ...formattedNewsData];
      successCount++;
      console.log(`NewsData: ${formattedNewsData.length} articles`);
    } else {
      console.log('NewsData failed:', apiCalls[1].reason?.message);
    }

    // Process CNN News articles
    if (apiCalls[2].status === 'fulfilled' && apiCalls[2].value?.data) {
      const formattedCNNData = apiCalls[2].value.data.map(article => ({
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
      successCount++;
      console.log(`CNN Indonesia: ${formattedCNNData.length} articles`);
    } else {
      console.log('CNN failed:', apiCalls[2].reason?.message);
    }

    console.log(`Successfully fetched from ${successCount}/3 APIs`);

    // Remove duplicates based on title similarity
    const uniqueArticles = combinedArticles.filter((article, index, self) => {
      if (!article.title) return false;
      
      return index === self.findIndex(a => {
        const titleA = a.title?.toLowerCase().trim();
        const titleB = article.title?.toLowerCase().trim();
        return titleA === titleB;
      });
    });

    // Sort by relevance (articles with search term in title first)
    if (keyword && keyword !== 'technology') {
      uniqueArticles.sort((a, b) => {
        const aHasKeywordInTitle = a.title?.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0;
        const bHasKeywordInTitle = b.title?.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0;
        return bHasKeywordInTitle - aHasKeywordInTitle;
      });
    }

    // Shuffle articles untuk mencampur sumber (only if no specific keyword)
    const finalArticles = keyword === 'technology' 
      ? uniqueArticles.sort(() => Math.random() - 0.5)
      : uniqueArticles;

    console.log(`Total unique articles: ${finalArticles.length}`);
    
    // Jika tidak ada artikel sama sekali, return data kosong tapi dengan info
    if (finalArticles.length === 0) {
      console.warn('No articles found from any API');
      return { 
        articles: [], 
        error: successCount === 0 ? 'All APIs failed' : 'No relevant articles found',
        apiStatus: {
          newsApi: apiCalls[0].status,
          newsData: apiCalls[1].status,
          cnnIndonesia: apiCalls[2].status
        }
      };
    }

    return { 
      articles: finalArticles,
      apiStatus: {
        newsApi: apiCalls[0].status,
        newsData: apiCalls[1].status,
        cnnIndonesia: apiCalls[2].status,
        successCount
      }
    };
  } catch (error) {
    console.error("Combined API Error:", error);
    return { 
      articles: [], 
      error: error.message,
      apiStatus: {
        newsApi: 'rejected',
        newsData: 'rejected',
        cnnIndonesia: 'rejected'
      }
    };
  }
};

// Fungsi khusus untuk berita terbaru dari NewsData
const getLatestNewsData = async (country = "id", language = "id") => {
  try {
    const params = {
      apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
      country: country,
      language: language,
      size: 50,
      category: 'technology,science,business'
    };
    
    const response = await newsDataClient.get("/api/1/latest", { params });
    return response.data;
  } catch (error) {
    console.error("NewsData Latest API Error:", error);
    
    // Fallback direct call
    try {
      const fallbackResponse = await axios.get("https://newsdata.io/api/1/latest", { params });
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error("NewsData Latest Fallback Error:", fallbackError);
      return { results: [] };
    }
  }
};

// Search suggestions for better UX
const getSearchSuggestions = () => {
  return [
    'AI', 'Smartphone', 'Komputer', 'Internet', 'Robot', 'Game', 
    'Aplikasi', 'Startup', 'Programming', 'Cybersecurity', 
    'Blockchain', 'Cloud', 'Data', 'Software', 'Hardware',
    'Tesla', 'Apple', 'Google', 'Microsoft', 'Samsung',
    'Instagram', 'WhatsApp', 'TikTok', 'YouTube', 'Facebook'
  ];
};

export { 
  getNews, 
  getNewsFromNewsData, 
  getAllNews, 
  getLatestNewsData, 
  getCNNNews,
  getSearchSuggestions 
};