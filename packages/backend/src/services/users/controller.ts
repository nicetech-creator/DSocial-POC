import e, { NextFunction, Request, response, Response } from 'express';
import axios, {AxiosResponse} from 'axios';
import { User } from '../../models/user.model';

export const find = (req: Request, res: Response, next: NextFunction) => {
	// If a query string ?publicAddress=... is given, then filter results
	const whereClause =
		req.query && req.query.publicAddress
			? {
					where: { publicAddress: req.query.publicAddress },
			  }
			: undefined;

	return User.findAll(whereClause)
		.then((users: User[]) => res.json(users))
		.catch(next);
};

export const get = (req: Request, res: Response, next: NextFunction) => {
	// AccessToken payload is in req.user.payload, especially its `id` field
	// UserId is the param in /users/:userId
	// We only allow user accessing herself, i.e. require payload.id==userId
	if ((req as any).user.payload.id !== +req.params.userId) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return User.findByPk(req.params.userId)
		.then(async (user: User | null) => {
			if (user == null) res.json(user)
			else if (!user?.ipfs) res.json({
				id: user?.id,
				publicAddress: user?.publicAddress
			})
			else {
				let url = `https://gateway.pinata.cloud/ipfs/${user.ipfs}`
				let response = await axios.get(url)
				if (response.data){
					res.json({
						id: user?.id,
						publicAddress: user?.publicAddress,
						username: response.data.username,
						email: response.data.email,
						address: response.data.address
					})
				} else {
					res.json({
						id: user?.id,
						publicAddress: user?.publicAddress
					})
				}
			}
			
		})
		.catch(next);
};

export const create = (req: Request, res: Response, next: NextFunction) =>
	User.create(req.body)
		.then((user: User) => res.json(user))
		.catch(next);

export const patch = (req: Request, res: Response, next: NextFunction) => {
	// Only allow to fetch current user
	if ((req as any).user.payload.id !== +req.params.userId) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return User.findByPk(req.params.userId)
		.then( async (user: User | null) => {
			if (!user) {
				return user;
			}

			// Object.assign(user, req.body);
			const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
			let response = await axios
				.post(url, req.body, {
					headers: {
						pinata_api_key: "daf5ad2aa9551c702354",
						pinata_secret_api_key: "d2fc6b79bae15c6850283cce863e461c9b454d3e7eba80a101b173eb1783fa67"
					}
				})
			if (response.data){
				user.ipfs = response.data.IpfsHash
			}
			return user.save();
		})
		.then((user: User | null) => {
			return user
				? res.json(user)
				: res.status(401).send({
						error: `User with publicAddress ${req.params.userId} is not found in database`,
				  });
		})
		.catch(next);
};
