// src/database/entities/Series.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Series {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  director!: string

  @Column()
  year!: number

  @Column({ name: 'short_description' })
  shortDescription!: string
}
