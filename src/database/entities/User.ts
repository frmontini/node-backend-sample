// src/database/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm'
import bcrypt from 'bcrypt'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  // Before inserting the user into the database, hash the password
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10)
  }
}
