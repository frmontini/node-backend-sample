// src/database/seed.ts
import { connection } from './connection'
import { User } from './entities/User'
import { Series } from './entities/Series'

// Seed the database with sample data for users and series, checking for duplicates
async function seedDatabase() {
  // Initialize the connection
  const conn = await connection

  // Get repositories for User and Series
  const userRepository = conn.getRepository(User)
  const seriesRepository = conn.getRepository(Series)

  // Sample users for authentication
  const sampleUsers = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    },
    {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password456'
    }
  ]

  // Insert sample users if they don't already exist
  for (const userData of sampleUsers) {
    const existingUser = await userRepository.findOne({ where: { email: userData.email } })
    if (!existingUser) {
      const user = userRepository.create(userData)
      await userRepository.save(user)
    }
  }

  // Sample series data
  const sampleSeries = [
    {
      name: 'Breaking Bad',
      director: 'Vince Gilligan',
      year: 2008,
      shortDescription: 'A high school teacher turns to making meth'
    },
    {
      name: 'Game of Thrones',
      director: 'Various',
      year: 2011,
      shortDescription: 'Noble families battle for control in a fantasy land'
    }
  ]

  // Insert sample series if they don't already exist
  for (const seriesData of sampleSeries) {
    const existingSeries = await seriesRepository.findOne({ where: { name: seriesData.name } })
    if (!existingSeries) {
      const series = seriesRepository.create(seriesData)
      await seriesRepository.save(series)
    }
  }

  console.log('Database seeded with sample data')
  // Optionally, you can close the connection if needed:
  // await conn.close()
}

// Run the seed script
seedDatabase()
