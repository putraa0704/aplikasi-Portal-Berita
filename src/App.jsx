import { useEffect, useState } from "react";
import { getAllNews, getCNNNews } from "./api/endpoints";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import NewsDetail from "./pages/NewsDetail";

function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllNews("technology");
        setNews(data?.articles || []);
      } catch (error) {
        console.error(error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700 drop-shadow-lg">
        📱 TechNews Indonesia
      </h1>

      {news.length === 0 ? (
        <p className="text-center text-gray-600">Tidak ada berita teknologi ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-3xl overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {item.urlToImage ? (
                <img
                  src={item.urlToImage}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                  No Image
                </div>
              )}
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
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsDetail />} />
      </Routes>
    </Router>
  );
}

export default App;