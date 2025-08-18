function Tentang() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
            Tentang AndraNews Indonesia
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Portal berita teknologi terpercaya yang menghadirkan informasi terkini seputar dunia teknologi Indonesia dan global.
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Misi */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">🎯</span>
              <h2 className="text-2xl font-bold text-blue-700">Misi Kami</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Menyediakan berita teknologi yang akurat, terpercaya, dan mudah dipahami untuk masyarakat Indonesia. 
              Kami berkomitmen untuk menjadi jembatan informasi antara perkembangan teknologi global dengan kebutuhan lokal.
            </p>
          </div>

          {/* Visi */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">🚀</span>
              <h2 className="text-2xl font-bold text-blue-700">Visi Kami</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Menjadi platform berita teknologi nomor satu di Indonesia yang membantu masyarakat memahami 
              dan mengadaptasi perkembangan teknologi dalam kehidupan sehari-hari.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">
              Mengapa Memilih AndraNews Indonesia?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Update Cepat</h3>
              <p className="text-gray-600 text-sm">
                Berita teknologi terbaru diupdate secara real-time dari berbagai sumber terpercaya.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Pencarian Mudah</h3>
              <p className="text-gray-600 text-sm">
                Fitur pencarian canggih untuk menemukan berita teknologi yang Anda butuhkan.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Responsif</h3>
              <p className="text-gray-600 text-sm">
                Akses mudah dari berbagai perangkat - desktop, tablet, maupun smartphone.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">AndraNews Indonesia dalam Angka</h2>
            <p className="opacity-90">Pencapaian kami hingga saat ini</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">1000+</div>
              <div className="text-sm opacity-90">Berita Teknologi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-90">Update Realtime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">3</div>
              <div className="text-sm opacity-90">Sumber Berita</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm opacity-90">Gratis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tentang;