// src/routes.ts
import { Router, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from './database/entities/User'
import { Series } from './database/entities/Series'
import { connection } from './database/connection'

// Extend Express Request interface to include "user" property
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

const router = Router()

// Secret key for JWT - use environment variables in production
const SECRET_KEY = 'your_secret_key'

// Middleware to authenticate JWT
const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' })
    return
  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    res.status(401).json({ message: 'Token missing' })
    return
  }
  try {
    const payload = jwt.verify(token, SECRET_KEY)
    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Route to authenticate user and generate JWT token
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }
    const conn = await connection
    const userRepository = conn.getRepository(User)
    const user = await userRepository.findOne({ where: { email } })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' })
    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Protected route to fetch user profile using the JWT middleware
router.get('/profile', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Token is valid', payload: req.user })
})

// Protected route to fetch the list of series only for authenticated users
router.get('/series', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const conn = await connection
    const seriesRepository = conn.getRepository(Series)
    const seriesList = await seriesRepository.find()
    res.json(seriesList)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Export the router to be used in index.ts
export const routes = router
