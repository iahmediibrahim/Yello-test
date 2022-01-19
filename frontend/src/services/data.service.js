import axios from 'axios'
import authHeader from './auth-header'
const API_URL_POSTS = 'http://localhost:5000/api/posts/'
const API_URL_USERS = 'http://localhost:5000/api/users/'

const getPublicContent = () => {
	return axios.get(API_URL_POSTS)
}
const getAllUsers = () => {
	return axios.get(API_URL_USERS, { headers: authHeader() })
}
const deleteEntry = (id) => {
	return axios.delete(API_URL_POSTS + id, { headers: authHeader() })
}
const addEntry = (userId, title, body) => {
	return axios.post(API_URL_POSTS, { userId, title, body }, { headers: authHeader() })
}
const updateEntry = (id, title, body) => {
	return axios.put(API_URL_POSTS + id, { title, body }, { headers: authHeader() })
}

const DataService = {
	getPublicContent,
	deleteEntry,
	addEntry,
	updateEntry,
	getAllUsers,
}
export default DataService
