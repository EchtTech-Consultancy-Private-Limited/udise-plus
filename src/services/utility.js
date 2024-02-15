import axios from 'axios'

export default axios.create({
    baseURL: 'http://localhost:49000/performance/',
    headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer df;lkjz8lke4lk345kljsdfkjdfgkljsf08994a/sdfljsdf879w4ra/sdflksdflksdf"
    }
})