import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@abtickets/common';
import { User } from '../models/User';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characterss')
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError('Email in Use');
		}

		const user = User.build({ email, password });
		await user.save();

		// generate jwt
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email
			},
			process.env.JWT_KEY!
		);

		// store on session object
		// @ts-ignore: Object assignment error
		req.session = {
			jwt: userJwt
		};

		res.status(201).send(user);
	}
);

export { router as signupRouter };
