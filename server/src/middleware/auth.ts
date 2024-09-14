import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify the token exists and add the user data to the request object
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists
  if (authHeader) {
    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1]; // split method returns an array using a space as the delimiter, then returns the second element, i.e. the token

    // Access the secret key to verify the token
    const secretKey = process.env.JWT_SECRET_KEY || '';

    // verify the token is valid and signed using the secret key
    jwt.verify(token, secretKey, (err, user) => {
      // if the token is invalid or expired, populate error parameter
      if (err) {
        return res.sendStatus(403); // Forbidden (due to invalid credentials)
      }

      // if the token is valid, add the user data to the request object
      req.user = user as JwtPayload;
      // continue to the next middleware
      return next();
    });
  } else {
    // if the authorization header does not exist
    res.sendStatus(401); // Unauthorized (due to missing credentials)
  }
};
