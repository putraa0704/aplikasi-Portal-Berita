import { useParams, useLocation, Navigate, useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NewsDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const article = location.state?.article;

  if (!article) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-blue-700 hover:text-blue-900 transition font-semibold"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="inline-block"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Kembali
        </button>

        {/* Card Utama */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Gambar Berita */}
          {article.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-gradient-to-tr from-blue-300 to-blue-500 flex items-center justify-center text-white text-xl md:text-2xl font-bold">
              No Image Available
            </div>
          )}

          {/* Konten */}
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-snug">
              {article.title}
            </h1>

            {/* Info Meta */}
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                {article.source?.name}
              </span>
              {article.author && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                  Penulis: {article.author}
                </span>
              )}
              {article.publishedAt && (
                <span className="text-xs md:text-sm text-gray-500">
                  {formatDate(article.publishedAt)}
                </span>
              )}
            </div>

            {/* Deskripsi */}
            {article.description && (
              <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
                {article.description}
              </p>
            )}

            {/* Isi Konten */}
            {article.content && (
              <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                <h2 className="text-lg md:text-xl font-bold mb-3 text-blue-700">
                  Isi Berita
                </h2>
                <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                  {article.content}
                </p>
              </div>
            )}

            {/* Link Sumber */}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full md:w-auto text-center bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition"
            >
              Kunjungi Sumber Asli →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;
