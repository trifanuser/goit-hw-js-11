// api.js
import axios from 'axios';

const API_KEY = '45110089-61221fbae9d31eb168708c8b4';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page = 1) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};