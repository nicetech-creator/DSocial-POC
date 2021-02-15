import './User.css';

import jwtDecode from 'jwt-decode';
import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Auth } from '../types';

interface RouteParams {
	id: string;
}

interface Props {
	auth: Auth;
	onLoggedOut: () => void;
}

interface State {
	loading: boolean;
	error?: string;
	user?: {
		id: number;
		username: string;
		email: string;
		address: string;
		error?: string;
	};
}

interface JwtDecoded {
	payload: {
		id: string;
		publicAddress: string;
	};
}

export const User: FC<Props> = (props: Props): ReactElement => {
	const params = useParams<RouteParams>();
	const [state, setState] = useState<State>({
		loading: true,
		user: undefined,
		error: undefined,
	});

	useEffect(() => {
		const {
			auth: { accessToken },
		} = props;
		const {
			payload: { id },
		} = jwtDecode<JwtDecoded>(accessToken);
		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${params.id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((user) =>
				setState({
					user: user,
					loading: false,
					error: undefined,
				})
			)
			.catch((err) =>
				setState({
					user: undefined,
					loading: false,
					error: 'Access Denied!',
				})
			);
	}, []);

	const username = state.user && state.user.username;
	const email = state.user && state.user.email;
	const address = state.user && state.user.address;
	const error = state.user && state.user.error;
	return (
		<div className="User">
			{error ? (
				<h3>{error}</h3>
			) : (
				<div>
					User Name: {username ? <pre>{username}</pre> : 'not set.'}
					Email: {email ? <pre>{email}</pre> : 'not set.'}
					Address: {address ? <pre>{address}</pre> : 'not set.'}
				</div>
			)}
		</div>
	);
};
