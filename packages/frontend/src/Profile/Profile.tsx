import './Profile.css';

import jwtDecode from 'jwt-decode';
import React from 'react';
import Blockies from 'react-blockies';

import { Auth } from '../types';

interface Props {
	auth: Auth;
	onLoggedOut: () => void;
}

interface State {
	loading: boolean;
	user?: {
		id: number;
		username: string;
		email: string;
		address: string;
	};
	username: string;
	email: string;
	address: string;
}

interface JwtDecoded {
	payload: {
		id: string;
		publicAddress: string;
	};
}

export class Profile extends React.Component<Props, State> {
	state: State = {
		loading: false,
		user: undefined,
		username: '',
		email: '',
		address: '',
	};

	componentDidMount() {
		const {
			auth: { accessToken },
		} = this.props;
		const {
			payload: { id },
		} = jwtDecode<JwtDecoded>(accessToken);

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((user) => this.setState({ user }))
			.catch(window.alert);
	}

	handleChange = ({
		target: { value },
	}: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ username: value });
	};

	handleChangeEmail = ({
		target: { value },
	}: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ email: value });
	};

	handleChangeAddress = ({
		target: { value },
	}: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ address: value });
	};

	handleSubmit = () => {
		const {
			auth: { accessToken },
		} = this.props;
		const { user, username, email, address } = this.state;

		this.setState({ loading: true });

		if (!user) {
			window.alert(
				'The user id has not been fetched yet. Please try again in 5 seconds.'
			);
			return;
		}

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`, {
			body: JSON.stringify({ username, email, address }),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			method: 'PATCH',
		})
			.then((response) => response.json())
			.then((user) => this.setState({ loading: false, user }))
			.catch((err) => {
				window.alert(err);
				this.setState({ loading: false });
			});
	};

	render() {
		const {
			auth: { accessToken },
			onLoggedOut,
		} = this.props;
		const {
			payload: { publicAddress },
		} = jwtDecode<JwtDecoded>(accessToken);
		const { loading, user } = this.state;

		const username = user && user.username;
		const email = user && user.email;
		const address = user && user.address;
		return (
			<div className="Profile">
				<p>
					Logged in as <Blockies seed={publicAddress} />
				</p>
				<div>
					User Name: {username ? <pre>{username}</pre> : 'not set.'}
					Public Address: <pre>{publicAddress}</pre>
					Email: {email ? <pre>{email}</pre> : 'not set.'}
					Address: {address ? <pre>{address}</pre> : 'not set.'}
				</div>
				<hr />
				<div>
					<label htmlFor="username">username: </label>
					<input name="username" onChange={this.handleChange} />
				</div>
				<div>
					<label htmlFor="email">email: </label>
					<input name="email" onChange={this.handleChangeEmail} />
				</div>
				<div>
					<label htmlFor="address">address: </label>
					<input name="address" onChange={this.handleChangeAddress} />
				</div>
				<p>
					<button disabled={loading} onClick={this.handleSubmit}>
						Submit
					</button>
				</p>
				<p>
					<button onClick={onLoggedOut}>Logout</button>
				</p>
			</div>
		);
	}
}
