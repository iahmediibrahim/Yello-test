import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { deletePost, getUsers } from '../store/slices/data'

const Profile = () => {
	const { user: currentUser } = useSelector((state) => state.auth)
	const [loading, setLoading] = useState(false)

	const filteredPosts = useSelector((state) => {
		const allPosts = state?.data?.posts
		return allPosts?.filter((p) => parseInt(p.userId, 10) === currentUser._id)
	})
	const [userPosts, setUserPosts] = useState([])
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [users, setUsers] = useState([])
	useEffect(() => {
		if (filteredPosts?.length !== 0 && filteredPosts !== undefined) setUserPosts(filteredPosts)
		dispatch(getUsers())
			.unwrap()
			.then((res) => {
				setUsers(res)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [currentUser, filteredPosts?.length, dispatch])

	if (!currentUser) {
		return <Navigate to='/login' />
	}

	return (
		<div className='container-fluid'>
			<header className='jumbotron'>
				<h3>
					<strong>{currentUser.username}</strong> Profile
				</h3>
				<p>
					<strong>Id:</strong> {currentUser._id}
				</p>
				<p>
					<strong>Email:</strong> {currentUser.email}
				</p>
				<button className='btn btn-primary mr-2 mb-2' onClick={() => navigate(`/post`, { replace: true })}>
					Add New Post
				</button>
			</header>

			<div className='row'>
				<div className='col-md-9'>
					<div className='row'>
						{userPosts.map((p) => (
							<div className='col-lg-4 col-md-6 col-sm-12' key={p._id}>
								<div className='card p-0'>
									<div className='card-header'>
										<h5 className='card-title'>{p.title}</h5>
									</div>
									<div className='card-body'>
										<p className='card-text'>{p.body}</p>
										<span className='text-dark'>User ID: {p.userId}</span>
									</div>
									<div className='card-footer d-flex justify-content-around'>
										<button
											className='btn btn-danger mb-2'
											onClick={() => {
												setLoading(true)
												dispatch(deletePost(p._id)).then(() => setLoading(false))
											}}
											disabled={loading}>
											{loading && <span className='spinner-border spinner-border-sm'></span>}
											Delete
										</button>

										<button
											className='btn btn-primary mr-2 mb-2'
											onClick={() => navigate(`/post/${p._id}`, { replace: true })}>
											Edit
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className='col-md-3'>
					<h3>Other Users Page:</h3>
					{users.map((u) => (
						<div key={u._id}>
							<Link to={`/user/${u._id}`}>User: {u.username}</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Profile
