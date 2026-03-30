import express from 'express'
import { monthlyReport, agentReport, farmerReport } from '../controllers/reportController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeAgentOrAdmin } from '../middleware/roles.js'

const router = express.Router()
router.use(authenticate, authorizeAgentOrAdmin)
router.get('/monthly', monthlyReport)
router.get('/agents', agentReport)
router.get('/farmers', farmerReport)

export default router
