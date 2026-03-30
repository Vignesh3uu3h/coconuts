import express from 'express'
import { getStockSummary } from '../controllers/stockController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeAgentOrAdmin } from '../middleware/roles.js'

const router = express.Router()
router.use(authenticate, authorizeAgentOrAdmin)
router.get('/current', getStockSummary)

export default router
