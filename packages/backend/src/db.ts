import os from 'os';
import path from 'path';
import { INTEGER, Sequelize, STRING } from 'sequelize';
import { User } from './models';

const sequelize = new Sequelize('login-with-metamask-database', '', undefined, {
	dialect: 'sqlite',
	storage: 'db.sqlite',
	logging: false,
});

const keyGen = (): string => {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (var i = 0; i < 16; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
  
	return text;
  }

// Init all models
User.init(
	{
		nonce: {
			allowNull: false,
			type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
			defaultValue: (): number => Math.floor(Math.random() * 10000), // Initialize with a random nonce
		},
		publicAddress: {
			allowNull: false,
			type: STRING,
			unique: true,
			validate: { isLowercase: true },
		},
		username: {
			type: STRING,
			unique: true,
		},
		secretKey: {
			allowNull: false,
			type: STRING,
			defaultValue: (): string => keyGen(), // Initialize with a random nonce
		},
		ipfs: {
			type: STRING
		},
		friends: {
			allowNull: false,
			type: STRING,
			defaultValue: (): string => JSON.stringify([]) // Initialize with a random nonce
		}
	},
	{
		modelName: 'user',
		sequelize, // This bit is important
		timestamps: false,
	}
);

// Create new tables
sequelize.sync();

export { sequelize };
