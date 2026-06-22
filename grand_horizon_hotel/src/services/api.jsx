import axios from 'axios';

// Create one Axios instance pointing to your live Render backend
// Every page imports this instead of typing the full URL
const API = axios.create({
  baseURL: 'https://final-capstone-2puq.onrender.com/api',
});

export default API;

//It creates a single Axios instance with your live backend URL. Every request from any page uses this instance, so you never repeat the base URL. If you ever change your backend URL (like from Render to another host), you change it in ONE place.//