import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AuthService from '../../services/auth.service'
import { setPosts } from './data'
import { setMessage } from './message'
const user = JSON.parse(localStorage.getItem('user'))
const initialState = user ? { isLoggedIn: true, user } : { isLoggedIn: false, user: null }
export const register = createAsyncThunk('auth/register', async ({ username, email, password }, thunkAPI) => {
	try {
		const res = await AuthService.register(username, email, password)
		thunkAPI.dispatch(setMessage(res.data.message))
		return res.data
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		thunkAPI.dispatch(setMessage(message))
		return thunkAPI.rejectWithValue()
	}
})

export const login = createAsyncThunk('auth/login', async ({ username, password }, thunkAPI) => {
	try {
		const user = await AuthService.login(username, password)
		thunkAPI.dispatch(setPosts())
		return { user }
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		thunkAPI.dispatch(setMessage(message))
		return thunkAPI.rejectWithValue()
	}
})

export const logout = createAsyncThunk('auth/logout', async () => {
	await AuthService.logout()
})

const authSlice = createSlice({
	name: 'auth',
	initialState,
	extraReducers: {
		[register.fulfilled]: (state, action) => {
			state.isLoggedIn = false
		},
		[register.rejected]: (state, action) => {
			state.isLoggedIn = false
		},
		[login.fulfilled]: (state, action) => {
			state.isLoggedIn = true
			state.user = action.payload.user
		},
		[login.rejected]: (state, action) => {
			state.isLoggedIn = false
			state.user = null
		},
		[logout.fulfilled]: (state, action) => {
			state.isLoggedIn = false
			state.user = null
		},
	},
})

const { reducer } = authSlice
export default reducer
