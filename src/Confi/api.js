import axios from 'axios';

const API_BASE_URL = axios.create({
  baseURL: 'https://lockated.com/api',
});

export default API_BASE_URL;
