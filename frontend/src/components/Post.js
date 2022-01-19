import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { addPost, updatePost } from '../store/slices/data'

const Post = (props) => {
	const { user: currentUser } = useSelector((state) => state.auth)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const [initialValues, setInitialValues] = useState({
		title: '',
		body: '',
	})
	const { message } = useSelector((state) => state.message)
	const location = useLocation()
	const locationStatus = location.pathname.split('/')[2] !== undefined
	const postId = location.pathname.split('/')[2]
	const post = useSelector((state) => {
		const allPosts = state?.data?.posts
		return allPosts?.find((p) => p._id === postId)
	})
	const dispatch = useDispatch()

	useEffect(() => {
		if (locationStatus && post?._id === postId) {
			setInitialValues({
				title: post.title,
				body: post.body,
			})
		}
	}, [locationStatus, post, postId])
	const validationSchema = Yup.object().shape({
		title: Yup.string().required('This field is required!'),
		body: Yup.string().required('This field is required!'),
	})

	const handlePost = (formValue) => {
		const { title, body } = formValue
		setLoading(true)
		if (locationStatus && post) {
			dispatch(updatePost({ id: postId, title, body }))
			navigate('/profile')
		} else {
			dispatch(addPost({ userId: currentUser._id, title, body }))
			navigate('/profile')
		}
	}

	return (
		<div className='col-md-12 Post-form'>
			{message && (
				<div className='form-group mt-5'>
					<div className='alert alert-danger' role='alert'>
						{message}
					</div>
				</div>
			)}
			<div className='card card-container'>
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handlePost}>
					<Form>
						<div className='form-group'>
							<label htmlFor='title'>title</label>
							<Field name='title' type='text' className='form-control' />
							<ErrorMessage name='title' component='div' className='alert alert-danger' />
						</div>

						<div className='form-group'>
							<label htmlFor='body'>body</label>
							<Field name='body' type='body' className='form-control' />
							<ErrorMessage name='body' component='div' className='alert alert-danger' />
						</div>

						<div className='form-group'>
							<button type='submit' className='btn btn-primary btn-block' disabled={loading}>
								{loading && <span className='spinner-border spinner-border-sm'></span>}
								<span>{locationStatus ? 'Update' : 'Post'}</span>
							</button>
						</div>
					</Form>
				</Formik>
			</div>
		</div>
	)
}

export default Post
