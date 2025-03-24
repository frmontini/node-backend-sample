// src/routes.ts
import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from './database/entities/User'
import { Series } from './database/entities/Series'
import { connection } from './database/connection'

const router = Router()

// Secret key for JWT - use environment variables in production
const SECRET_KEY = 'your_secret_key'

// Route to authenticate user and generate JWT token
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Validate that email and password are provided
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    // Ensure the database connection is ready
    const conn = await connection
    const userRepository = conn.getRepository(User)

    // Find user by email
    const user = await userRepository.findOne({ where: { email } })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // Compare plaintext password with encrypted password from database
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // Generate a JWT token with the user id and a 1-hour expiration
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' })
    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Example of a protected route that verifies the JWT token
router.get('/profile', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' })
    return
  }

  // Extract token from the 'Bearer <token>' format
  const token = authHeader.split(' ')[1]
  if (!token) {
    res.status(401).json({ message: 'Token missing' })
    return
  }

  try {
    // Verify the token
    const payload = jwt.verify(token, SECRET_KEY)
    res.json({ message: 'Token is valid', payload })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

// Protected route to fetch the list of series only for authenticated users
router.get('/series', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' })
    return
  }

  // Extract token from the 'Bearer <token>' format
  const token = authHeader.split(' ')[1]
  if (!token) {
    res.status(401).json({ message: 'Token missing' })
    return
  }

  try {
    // Verify the token (payload is not used here but can be if needed)
    jwt.verify(token, SECRET_KEY)

    // If valid, retrieve all series from the database
    const conn = await connection
    const seriesRepository = conn.getRepository(Series)
    const seriesList = await seriesRepository.find()
    res.json(seriesList)
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

// Export the router to be used in index.ts
export const routes = router
