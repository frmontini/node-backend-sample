// src/index.ts
import 'reflect-metadata'
import express from 'express'
import { routes } from './routes'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware to parse JSON and urlencoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Use routes defined in routes.ts with base path '/api'
app.use('/api', routes)

// Start the server and log a message
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})