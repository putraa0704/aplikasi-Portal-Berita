import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // NewsAPI proxy
      "/v2": {
        target: "https://newsapi.org", 
        changeOrigin: true,
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('NewsAPI proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('NewsAPI proxy request:', req.url);
          });
        }
      },
      // NewsData.io proxy
      "/newsdata": {
        target: "https://newsdata.io",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/newsdata/, ""),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('NewsData proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('NewsData proxy request:', req.url);
          });
        }
      },
      // CNN API proxy
      "/cnn-api": {
        target: "https://berita-indo-api-next.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/cnn-api/, ""),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('CNN proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('CNN proxy request:', req.url);
          });
        }
      },
    },
  },
})