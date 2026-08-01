import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const diseases = pgTable('diseases', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  crop: varchar('crop', { length: 255 }).notNull(),
  symptoms: text('symptoms').notNull(),
  prevention: text('prevention'),
  treatment: text('treatment'),
  severity: varchar('severity', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const pests = pgTable('pests', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  crop: varchar('crop', { length: 255 }).notNull(),
  symptoms: text('symptoms').notNull(),
  prevention: text('prevention'),
  controlMethods: text('control_methods'),
  severity: varchar('severity', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const crops = pgTable('crops', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  soilType: text('soil_type'),
  phLevel: varchar('ph_level', { length: 50 }),
  waterRequirement: text('water_requirement'),
  fertilizerRequirement: text('fertilizer_requirement'),
  season: varchar('season', { length: 100 }),
  yieldPotential: text('yield_potential'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const uploads = pgTable('uploads', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }),
  fileData: text('file_data'),
  fileSize: integer('file_size'),
  analysisResult: text('analysis_result'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
})

export const technologies = pgTable('technologies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  description: text('description'),
  benefits: text('benefits'),
  cost: varchar('cost', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const livestreams = pgTable('livestreams', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  streamStatus: varchar('stream_status', { length: 50 }),
  streamUrl: text('stream_url'),
  startedAt: timestamp('started_at'),
  createdAt: timestamp('created_at').defaultNow(),
})
