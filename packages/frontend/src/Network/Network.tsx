import './Network.css';

import jwtDecode from 'jwt-decode';
import React from 'react';
import Blockies from 'react-blockies';
import { Link } from 'react-router-dom';
import { Auth } from '../types';

interface Props {
	auth: Auth;
	onLoggedOut: () => void;
}

interface User {
	id: number;
	publicAddress: string;
}

interface State {
	loading: boolean;
	users?: User[];
	friends?: number[];
}

interface JwtDecoded {
	payload: {
		id: string;
		publicAddress: string;
	};
}

export class Network extends React.Component<Props, State> {
	state: State = {
		loading: false,
		users: [],
		friends: [],
	};

	componentDidMount() {
		const {
			auth: { accessToken },
		} = this.props;
		const {
			payload: { id },
		} = jwtDecode<JwtDecoded>(accessToken);

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((users) => this.setState({ users }))
			.catch(window.alert);

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((user) => this.setState({ friends: user.friends }))
			.catch(window.alert);
	}

	handleGrant(userId: number) {
		const {
			auth: { accessToken },
		} = this.props;

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/add/${userId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((user) => this.setState({ friends: user.friends }))
			.catch(window.alert);
	}

	handleReverk(userId: number) {
		const {
			auth: { accessToken },
		} = this.props;

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/reverk/${userId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((user) => this.setState({ friends: user.friends }))
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
		const { loading, users } = this.state;
		console.log('users:', users);
		return (
			<div className="network">
				<p>My Network</p>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Public Address</th>
							<th>Access</th>
						</tr>
					</thead>
					<tbody>
						{users?.map((u, idx) => {
							if (u.publicAddress != publicAddress)
								return (
									<tr key={idx}>
										<td>{u.id}</td>
										<td>
											<Link to={`/user/${u.id}`}>
												{u.publicAddress}
											</Link>
										</td>
										<td>
											{this.state.friends?.includes(
												u.id
											) ? (
												<button
													onClick={() => {
														this.handleReverk(u.id);
													}}
												>
													Reverk
												</button>
											) : (
												<button
													onClick={() => {
														this.handleGrant(u.id);
													}}
												>
													Grant
												</button>
											)}
										</td>
									</tr>
								);
							else return null;
						})}
					</tbody>
				</table>
			</div>
		);
	}
}
