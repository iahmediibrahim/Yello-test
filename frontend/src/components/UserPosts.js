import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const UserPosts = () => {
	const location = useLocation()
	const userId = parseInt(location.pathname.split('/')[2], 10)

	const filteredPosts = useSelector((state) => {
		const allPosts = state.data.posts
		return allPosts.filter((p) => parseInt(p.userId, 10) === userId)
	})
	const user = useSelector((state) => {
		const users = state.data.users
		return users.find((u) => u._id === userId)
	})

	const [content, setContent] = useState([])

	useEffect(() => {
		if (filteredPosts.length !== 0) setContent(filteredPosts)
	}, [filteredPosts.length])

	return (
		<div className='container'>
			<h2 className='my-5'> {user.username} Posts</h2>
			<header className='row'>
				{content.map((p) => (
					<div className='col-md-4' key={p._id}>
						<div className='card card-container'>
							<div className='card-body'>
								<h5 className='card-title'>{p.title}</h5>
								<p className='card-text'>{p.body}</p>
								<span>User ID: {p.userId}</span>
							</div>
						</div>
					</div>
				))}
			</header>
		</div>
	)
}

export default UserPosts
