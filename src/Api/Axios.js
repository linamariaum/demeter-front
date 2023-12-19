import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://demeter-back-production-6a5a.up.railway.app',  // 'http://localhost:5080',  
    withCredentials: true
})

export default instance