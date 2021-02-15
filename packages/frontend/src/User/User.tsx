import './User.css';

import jwtDecode from 'jwt-decode';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
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
}

interface JwtDecoded {
	payload: {
		id: string;
		publicAddress: string;
	};
}

export class User extends React.Component<Props, State> {
	state: State = {
		loading: false,
		user: undefined,
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
		return <div className="User">{username}</div>;
	}
}
