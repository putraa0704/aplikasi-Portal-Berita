import { useEffect, useState } from "react";
import { getAllNews } from "./api/endpoints";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NewsDetail from "./pages/NewsDetail";
import Tentang from "./pages/Tentang";
import Kontak from "./pages/Kontak";
import Navbar from "./components/Navbar";

function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSearch, setCurrentSearch] = useState("technology");
  const [searchResults, setSearchResults] = useState({ total: 0, hasResults: true });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchNews = async (searchTerm = "technology") => {
    setLoading(true);
    console.log(`Fetching news for: ${searchTerm}`);
    
    try {
      const data = await getAllNews(searchTerm);
      const articles = data?.articles || [];
      
      setNews(articles);
      setSearchResults({
        total: articles.length,
        hasResults: articles.length > 0,
        searchTerm: searchTerm
      });
      
      console.log(`Found ${articles.length} articles for "${searchTerm}"`);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
      setSearchResults({
        total: 0,
        hasResults: false,
        searchTerm: searchTerm
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if there's a search query from navigation state
    const searchQuery = location.state?.searchQuery;
    if (searchQuery) {
      setCurrentSearch(searchQuery);
      fetchNews(searchQuery);
      // Clear the navigation state
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      fetchNews();
    }
  }, [location.state]);

  const handleSearch = (searchQuery) => {
    setCurrentSearch(searchQuery);
    fetchNews(searchQuery);
  };

  if (loading) {
    return (
      <>
        <Navbar onSearch={handleSearch} />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <span className="absolute top-4 left-4 text-blue-600 text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Mencari Berita...
            </h3>
            <p className="text-gray-500">
              {currentSearch !== "technology" 
                ? `Mencari "${currentSearch}"...` 
                : "Memuat berita teknologi terbaru..."
              }
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Search Info */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-4 text-blue-700 drop-shadow-lg">
              📱 TechNews Indonesia
            </h1>
            
            {/* Search Results Info */}
            {currentSearch !== "technology" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mx-auto inline-block mb-4 border border-blue-100">
                <p className="text-gray-700">
                  {searchResults.hasResults ? (
                    <>
                      Ditemukan <span className="font-bold text-blue-700">{searchResults.total}</span> berita untuk 
                      <span className="font-semibold text-blue-700 mx-1">"{currentSearch}"</span>
                      <button
                        onClick={() => {
                          setCurrentSearch("technology");
                          fetchNews("technology");
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Lihat semua berita
                      </button>
                    </>
                  ) : (
                    <>
                      Tidak ada hasil untuk <span className="font-semibold text-red-600">"{currentSearch}"</span>
                      <button
                        onClick={() => {
                          setCurrentSearch("technology");
                          fetchNews("technology");
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Lihat semua berita
                      </button>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Search Suggestions for No Results */}
          {!searchResults.hasResults && currentSearch !== "technology" && (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tidak ada berita ditemukan
              </h2>
              <p className="text-gray-600 mb-6">
                Coba kata kunci lain atau pilih dari saran di bawah:
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['AI', 'Smartphone', 'Game', 'Aplikasi', 'Robot', 'Startup', 'Komputer', 'Internet'].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full transition-colors font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <h3 className="font-semibold text-yellow-800 mb-2">💡 Tips Pencarian:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Gunakan kata kunci dalam bahasa Indonesia atau Inggris</li>
                  <li>• Coba kata kunci yang lebih umum (misal: "teknologi" bukan "tekno")</li>
                  <li>• Gunakan sinonim atau kata terkait</li>
                </ul>
              </div>
            </div>
          )}

          {/* News Articles */}
          {searchResults.hasResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <div
                  key={`${item.apiSource}-${index}`}
                  className="bg-white shadow-xl rounded-3xl overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  {item.urlToImage ? (
                    <img
                      src={item.urlToImage}
                      alt={item.title}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-56 bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center text-white text-2xl font-bold"
                    style={{ display: item.urlToImage ? 'none' : 'flex' }}
                  >
                    📰 No Image
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-bold mb-2 text-blue-800 line-clamp-2">{item.title}</h2>
                    <p className="text-gray-700 text-base mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">
                          {item.source?.name}
                        </span>
                        {item.apiSource && (
                          <span className={`text-xs px-2 py-1 rounded text-white ${
                            item.apiSource === 'NewsAPI' 
                              ? 'bg-blue-500' 
                              : item.apiSource === 'CNN Indonesia'
                              ? 'bg-red-500'
                              : 'bg-green-500'
                          }`}>
                            {item.apiSource}
                          </span>
                        )}
                      </div>
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-blue-700 transition"
                        onClick={() =>
                          navigate(`/news/${index}`, { state: { article: item } })
                        }
                      >
                        Baca selengkapnya →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<><Navbar /><NewsDetail /></>} />
        <Route path="/tentang" element={<><Navbar /><Tentang /></>} />
        <Route path="/kontak" element={<><Navbar /><Kontak /></>} />
      </Routes>
    </Router>
  );
}

export default App;