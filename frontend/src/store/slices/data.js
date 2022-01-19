import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import DataService from '../../services/data.service'
import { setMessage } from './message'
const initialState = { posts: [], users: [] }
export const setPosts = createAsyncThunk('data/setPosts', async (thunkAPI) => {
	try {
		const getPosts = await DataService.getPublicContent()
		const posts = getPosts.data
		return posts
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		thunkAPI.dispatch(setMessage(message))
		return thunkAPI.rejectWithValue()
	}
})
export const addPost = createAsyncThunk('data/addPost', async ({ userId, title, body }, thunkAPI) => {
	try {
		const result = await DataService.addEntry(userId, title, body)
		const posts = result.data
		thunkAPI.dispatch(setPosts())
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		thunkAPI.dispatch(setMessage(message))
		return thunkAPI.rejectWithValue()
	}
})
export const updatePost = createAsyncThunk('data/updatePost', async ({ id, title, body }, thunkAPI) => {
	try {
		const result = await DataService.updateEntry(id, title, body)
		const posts = result.data
		thunkAPI.dispatch(setPosts())
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		thunkAPI.dispatch(setMessage(message))
		return thunkAPI.rejectWithValue()
	}
})
export const deletePost = createAsyncThunk('data/deletePost', async (id, thunkAPI) => {
	try {
		const result = await DataService.deleteEntry(id)
		const posts = result.data
		thunkAPI.dispatch(setPosts())
		return posts
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		thunkAPI.dispatch(setMessage(message))

		return thunkAPI.rejectWithValue()
	}
})

export const getUsers = createAsyncThunk('data/getUsers', async (thunkAPI) => {
	try {
		const users = await DataService.getAllUsers()
		return users.data
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		thunkAPI.dispatch(setMessage(message))
		return thunkAPI.rejectWithValue()
	}
})
const dataSlice = createSlice({
	name: 'data',
	initialState,
	extraReducers: {
		[setPosts.fulfilled]: (state, action) => {
			state.posts = action.payload
		},
		[setPosts.rejected]: (state, action) => {
			state.posts = []
		},
		[deletePost.fulfilled]: (state, action) => {
			state.posts = action.payload
		},
		[deletePost.rejected]: (state, action) => {
			return state
		},
		[updatePost.fulfilled]: (state, action) => {
			state.posts = action.payload
		},
		[updatePost.rejected]: (state, action) => {
			return state
		},
		[updatePost.fulfilled]: (state, action) => {
			state.posts = action.payload
		},
		[updatePost.rejected]: (state, action) => {
			return state
		},
		[getUsers.fulfilled]: (state, action) => {
			state.users = action.payload
		},
	},
})

const { reducer } = dataSlice
export default reducer
