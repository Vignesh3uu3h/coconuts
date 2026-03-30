import app from './app.js'
import { sequelize } from './config/db.js'
import { QueryTypes } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8000
const HOST = '0.0.0.0'
const isProduction = process.env.NODE_ENV === 'production'

const cleanupSqliteBackupTables = async () => {
  if (sequelize.getDialect() !== 'sqlite') return

  const backups = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%\\_backup';",
    { type: QueryTypes.SELECT }
  )

  for (const backup of backups) {
    await sequelize.query(`DROP TABLE IF EXISTS "${backup.name}";`)
  }
}

const startServer = async () => {
  try {
    await sequelize.authenticate()
    await cleanupSqliteBackupTables()
    await sequelize.sync(isProduction ? {} : { alter: true })
    console.log('Database synced successfully.')
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

startServer()
