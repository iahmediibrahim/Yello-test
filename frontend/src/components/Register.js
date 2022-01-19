import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { register } from '../store/slices/auth'
import { clearMessage } from '../store/slices/message'

const Register = () => {
	const [successful, setSuccessful] = useState(false)

	const { message } = useSelector((state) => state.message)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(clearMessage())
	}, [dispatch])

	const initialValues = {
		username: '',
		email: '',
		password: '',
	}

	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.test(
				'len',
				'The username must be between 3 and 20 characters.',
				(val) => val && val.toString().length >= 3 && val.toString().length <= 20,
			)
			.required('This field is required!'),
		email: Yup.string().email('This is not a valid email.').required('This field is required!'),
		password: Yup.string()
			.test(
				'len',
				'The password must be between 6 and 40 characters.',
				(val) => val && val.toString().length >= 6 && val.toString().length <= 40,
			)
			.required('This field is required!'),
	})

	const handleRegister = (formValue) => {
		const { username, email, password } = formValue

		setSuccessful(false)

		dispatch(register({ username, email, password }))
			.unwrap()
			.then(() => {
				setSuccessful(true)
			})
			.catch(() => {
				setSuccessful(false)
			})
	}

	return (
		<div className='col-md-12 signup-form'>
			{message && (
				<div className='form-group mt-5'>
					<div className={successful ? 'alert alert-success' : 'alert alert-danger'} role='alert'>
						{message}
					</div>
				</div>
			)}
			<div className='card card-container'>
				<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleRegister}>
					<Form>
						{!successful ? (
							<div>
								<div className='form-group'>
									<label htmlFor='username'>Username</label>
									<Field name='username' type='text' className='form-control' />
									<ErrorMessage name='username' component='div' className='alert alert-danger' />
								</div>

								<div className='form-group'>
									<label htmlFor='email'>Email</label>
									<Field name='email' type='email' className='form-control' />
									<ErrorMessage name='email' component='div' className='alert alert-danger' />
								</div>

								<div className='form-group'>
									<label htmlFor='password'>Password</label>
									<Field name='password' type='password' className='form-control' />
									<ErrorMessage name='password' component='div' className='alert alert-danger' />
								</div>

								<div className='form-group'>
									<button type='submit' className='btn btn-primary btn-block'>
										Sign Up
									</button>
								</div>
							</div>
						) : (
							<div>
								<h1>Registration successfull!</h1>
							</div>
						)}
					</Form>
				</Formik>
			</div>
		</div>
	)
}

export default Register
