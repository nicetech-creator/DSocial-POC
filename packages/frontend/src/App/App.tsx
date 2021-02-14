import './App.css';

import React from 'react';
import { HashRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import { Login } from '../Login';
import { Profile } from '../Profile/Profile';
import { Auth } from '../types';
import logo from './logo.svg';

const LS_KEY = 'login-with-metamask:auth';

interface State {
	auth?: Auth;
}

export class App extends React.Component<unknown, State> {
	state: State = {};

	componentDidMount() {
		// Access token is stored in localstorage
		const ls = window.localStorage.getItem(LS_KEY);
		const auth = ls && JSON.parse(ls);
		this.setState({
			auth,
		});
	}

	handleLoggedIn = (auth: Auth) => {
		localStorage.setItem(LS_KEY, JSON.stringify(auth));
		this.setState({ auth });
	};

	handleLoggedOut = () => {
		localStorage.removeItem(LS_KEY);
		this.setState({ auth: undefined });
	};

	render() {
		const { auth } = this.state;

		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">
						Welcome to Decentralized Social POC
					</h1>
					<ul>
						<li>
							<a href="#/profile">My Profile</a>
						</li>
					</ul>
				</header>
				<div className="App-intro">
					{auth ? (
						<HashRouter>
							<Route path="/profile">
								<Profile
									auth={auth}
									onLoggedOut={this.handleLoggedOut}
								/>
							</Route>
							<Redirect to="/profile" /> :
						</HashRouter>
					) : (
						<Login onLoggedIn={this.handleLoggedIn} />
					)}
				</div>
			</div>
		);
	}
}
