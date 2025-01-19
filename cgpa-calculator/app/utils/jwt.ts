"use server";
import jwt from 'jsonwebtoken';

export const generateToken = async () => {

	const payload = {
		timestamp: Date.now(),
		source: 'uaf-calculator'
	};

	const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string;

	try {
		const token = await jwt.sign(payload, secretKey, {
			expiresIn: '1h',
			algorithm: 'HS256'
		});
		return token;
	} catch (error) {
		console.error('Error generating JWT token:', error);
		return null;
	}
};
