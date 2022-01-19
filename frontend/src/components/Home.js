import React from 'react'

const Home = (props) => {
	return (
		<div className='container'>
			<header className='row'>
				{props.content.map((p) => (
					<div className='col-md-4' key={p._id}>
						<div className='card card-container'>
							<div className='card-body'>
								<h5 className='card-title'>{p.title}</h5>
								<p className='card-text'>{p.body}</p>
								<span className=''>User ID: {p.userId}</span>
							</div>
						</div>
					</div>
				))}
			</header>
		</div>
	)
}

export default Home
