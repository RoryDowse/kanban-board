import { Router } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const login = async (req, res) => {
    // TODO: If the user exists and the password is correct, return a JWT token
    // Destructure the username and password from the request body (the data sent by the client on the form submission)
    const { username, password } = req.body;
    // Find the user in the database
    const user = await User.findOne({
        where: { username },
    });
    // Check if the user exists
    if (!user) {
        return res.status(401).json({ message: 'Authentication failed' }); // Message is custom key in JSON object (part of the response body)
    }
    // Compare plain text password provided by user with hashed password in database
    // Await keyword waits for the promise (true or false)to resolve before moving on
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
    // Retrieve the secret key
    const secretKey = process.env.JWT_SECRET_KEY || '';
    // Generate a JWT token
    { /* Username is the payload which will be encoded into the JWT
     secretKey is used to sign the token (ensures token integrity and authenticity)
    expiresIn is how long the token will be valid for */
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    // Send the token to the client for local storage (or other purposes)
    return res.json({ token });
};
const router = Router();
// POST /login - Login a user
router.post('/login', login);
export default router;
