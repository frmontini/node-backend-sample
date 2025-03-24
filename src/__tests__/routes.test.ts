// src/__tests__/series.test.ts
import request from 'supertest'
import express from 'express'
import { routes } from '../routes'
import { connection } from '../database/connection'
import { getRepository } from 'typeorm'
import { User } from '../database/entities/User'
import { Series } from '../database/entities/Series'

let app: express.Application

// Setup the app and seed test data before all tests run
beforeAll(async () => {
  // Ensure the database connection is ready
  await connection

  // Setup express app with JSON parsing and routes
  app = express()
  app.use(express.json())
  app.use(routes)

  // Seed a test user for authentication
  const userRepository = getRepository(User)
  const testUser = userRepository.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword' // This password will be hashed by the entity hook
  })
  await userRepository.save(testUser)

  // Seed a sample series record
  const seriesRepository = getRepository(Series)
  const sampleSeries = seriesRepository.create({
    name: 'Test Series',
    director: 'Test Director',
    year: 2020,
    shortDescription: 'Short description of test series'
  })
  await seriesRepository.save(sampleSeries)
})

// Close the database connection after tests complete
afterAll(async () => {
  const conn = await connection
  await conn.close()
})

describe('GET /series endpoint', () => {
  // Test that accessing /series without a token returns 401
  it('should return 401 if no token provided', async () => {
    const response = await request(app).get('/series')
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Authorization header missing')
  })

  // Test that an authenticated user can access /series and get the list
  it('should return list of series for authenticated user', async () => {
    // First, login to obtain a JWT token
    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'testpassword' })
    expect(loginResponse.status).toBe(200)
    const token = loginResponse.body.token
    expect(token).toBeDefined()

    // Use the token to access the protected /series endpoint
    const seriesResponse = await request(app)
      .get('/series')
      .set('Authorization', `Bearer ${token}`)
    expect(seriesResponse.status).toBe(200)
    expect(Array.isArray(seriesResponse.body)).toBe(true)
    expect(seriesResponse.body.length).toBeGreaterThan(0)
  })
})
