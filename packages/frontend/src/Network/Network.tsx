import './Network.css';

import jwtDecode from 'jwt-decode';
import React from 'react';
import Blockies from 'react-blockies';

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
						{users?.map((u, idx) => (
							<tr key={idx}>
								<td>{u.id}</td>
								<td>{u.publicAddress}</td>
								<td>Allow</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}
