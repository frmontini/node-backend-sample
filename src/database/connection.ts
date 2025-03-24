// src/database/connection.ts
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { Series } from './entities/Series'

// Create a TypeORM connection using a file-based SQLite database for persistence
export const connection = createConnection({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true, // auto create/update tables (good for development)
  logging: false,
  entities: [User, Series]
})
