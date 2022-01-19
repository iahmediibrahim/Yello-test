import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth'
import dataReducer from './slices/data'
import messageReducer from './slices/message'
const reducer = {
	auth: authReducer,
	message: messageReducer,
	data: dataReducer,
}
export default configureStore({
	reducer,
	devTools: true,
})
