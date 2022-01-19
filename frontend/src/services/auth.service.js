import axios from 'axios'
const API_URL = 'http://localhost:5000/api/auth/'
const register = (username, email, password) => {
	return axios.post(API_URL + 'register', {
		username,
		email,
		password,
	})
}
const login = (username, password) => {
	return axios
		.post(API_URL + 'login', {
			username,
			password,
		})
		.then((res) => {
			if (res.data.accessToken) {
				localStorage.setItem('user', JSON.stringify(res.data))
			}
			return res.data
		})
}
const logout = () => {
	localStorage.removeItem('user')
}
const AuthService = { register, login, logout }
export default AuthService
