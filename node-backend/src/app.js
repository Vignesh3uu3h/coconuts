import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import agentRoutes from './routes/agents.js'
import farmerRoutes from './routes/farmers.js'
import purchaseRoutes from './routes/purchases.js'
import buyerRoutes from './routes/buyers.js'
import saleRoutes from './routes/sales.js'
import stockRoutes from './routes/stock.js'
import dashboardRoutes from './routes/dashboard.js'
import reportRoutes from './routes/reports.js'
import notificationRoutes from './routes/notifications.js'

dotenv.config()
const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/farmers', farmerRoutes)
app.use('/api/purchases', purchaseRoutes)
app.use('/api/buyers', buyerRoutes)
app.use('/api/sales', saleRoutes)
app.use('/api/stock', stockRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/notifications', notificationRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

export default app
