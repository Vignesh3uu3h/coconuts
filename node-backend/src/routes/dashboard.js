import express from 'express'
import { dashboardSummary } from '../controllers/dashboardController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeAgentOrAdmin } from '../middleware/roles.js'

const router = express.Router()
router.use(authenticate, authorizeAgentOrAdmin)
router.get('/summary', dashboardSummary)

export default router
