import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://demeter-back-production-a317.up.railway.app', // 'http://localhost:5080'
    withCredentials: true
})

export default instance