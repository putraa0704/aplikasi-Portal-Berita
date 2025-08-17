import axiosClient from "./axiosClient";

// get method
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
    console.error(error);
    return null; // Tambahkan ini agar tidak undefined
  }
};

export { getNews };
