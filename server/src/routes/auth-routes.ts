import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  // TODO: If the user exists and the password is correct, return a JWT token
  // destructure the username and password from the request body (the data sent by the client on the form submission)
  const { username, password } = req.body;

  // find the user in the database
  const user = await User.findOne({
    where: { username },
  });
  // check if the user exists
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' }); // message is custom key in JSON object (part of the response body)
  }

  // compare plain text password provided by user with hashed password in database
  // await keyword waits for the promise (true or false)to resolve before moving on
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // retrieve the secret key
  const secretKey = process.env.JWT_SECRET_KEY || '';

  // generate a JWT token
  // username is the payload which will be encoded into the JWT
  // secretKey is used to sign the token (ensures token integrity and authenticity)
  // expiresIn is how long the token will be valid for
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  // send the token to the client for local storage (or other purposes)
  return res.json({ token });
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
