import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import EventBus from './common/EventBus'
import Home from './components/Home'
import Login from './components/Login'
import Post from './components/Post'
import Profile from './components/Profile'
import Register from './components/Register'
import UserPosts from './components/UserPosts'
import { logout } from './store/slices/auth'
import { setPosts } from './store/slices/data'

function App() {
	const { user: currentUser } = useSelector((state) => state.auth)
	// const { posts } = useSelector((state) => state.data)
	const dispatch = useDispatch()
	const [content, setContent] = useState([])
	const getPosts = useCallback(() => {
		dispatch(setPosts())
			.unwrap()
			.then((res) => {
				setContent(res)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [dispatch])

	const logOut = useCallback(() => {
		dispatch(logout())
	}, [dispatch])
	useEffect(() => {
		getPosts()
		EventBus.on('logout', () => {
			logOut()
		})

		return () => {
			EventBus.remove('logout')
		}
	}, [currentUser, logOut, getPosts])

	return (
		<>
			<nav className='navbar navbar-expand navbar-dark bg-dark'>
				<Link to={'/'} className='navbar-brand'>
					Yollo
				</Link>
				<div className='navbar-nav mr-auto'>
					<li className='nav-item'>
						<Link to={'/'} className='nav-link'>
							Home
						</Link>
					</li>
				</div>

				{currentUser ? (
					<div className='navbar-nav ml-auto'>
						<li className='nav-item'>
							<Link to={'/profile'} className='nav-link'>
								{currentUser.username} Profile
							</Link>
						</li>
						<li className='nav-item'>
							<Link to={'/'} className='nav-link' onClick={logOut}>
								LogOut
							</Link>
						</li>
					</div>
				) : (
					<div className='navbar-nav ml-auto'>
						<li className='nav-item'>
							<Link to={'/login'} className='nav-link'>
								Login
							</Link>
						</li>

						<li className='nav-item'>
							<Link to={'/register'} className='nav-link'>
								Sign Up
							</Link>
						</li>
					</div>
				)}
			</nav>

			<Routes>
				<Route path='/' element={<Home content={content} />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/user/:id' element={<UserPosts />} />
				<Route path='/post' element={<Post />} />
				<Route path='/post/:id' element={<Post />} />
			</Routes>
		</>
	)
}

export default App
