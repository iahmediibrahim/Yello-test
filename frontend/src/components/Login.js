import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import * as Yup from 'yup'
import { login } from '../store/slices/auth'
import { clearMessage } from '../store/slices/message'

const Login = (props) => {
	const [loading, setLoading] = useState(false)

	const { isLoggedIn } = useSelector((state) => state.auth)
	const { message } = useSelector((state) => state.message)
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(clearMessage())
	}, [dispatch])

	const initialValues = {
		username: '',
		password: '',
	}

	const validationSchema = Yup.object().shape({
		username: Yup.string().required('This field is required!'),
		password: Yup.string().required('This field is required!'),
	})

	const handleLogin = (formValue) => {
		const { username, password } = formValue
		setLoading(true)

		dispatch(login({ username, password }))
			.unwrap()
			.then(() => {
				props.history.push('/')
				window.location.reload()
			})
			.catch(() => {
				setLoading(false)
			})
	}

	if (isLoggedIn) {
		return <Navigate to='/' />
	}

	return (
		<div className='col-md-12 login-form'>
			{message && (
				<div className='form-group mt-5'>
					<div className='alert alert-danger' role='alert'>
						{message}
					</div>
				</div>
			)}
			<div className='card card-container'>
				<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
					<Form>
						<div className='form-group'>
							<label htmlFor='username'>Username</label>
							<Field name='username' type='text' className='form-control' />
							<ErrorMessage name='username' component='div' className='alert alert-danger' />
						</div>

						<div className='form-group'>
							<label htmlFor='password'>Password</label>
							<Field name='password' type='password' className='form-control' />
							<ErrorMessage name='password' component='div' className='alert alert-danger' />
						</div>

						<div className='form-group'>
							<button type='submit' className='btn btn-primary btn-block' disabled={loading}>
								{loading && <span className='spinner-border spinner-border-sm'></span>}
								<span>Login</span>
							</button>
						</div>
					</Form>
				</Formik>
			</div>
		</div>
	)
}

export default Login
