import express from 'express'
import { listNotifications, runReminderNow } from '../controllers/notificationController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeAgentOrAdmin } from '../middleware/roles.js'

const router = express.Router()
router.use(authenticate, authorizeAgentOrAdmin)
router.get('/', listNotifications)
router.post('/run-now', runReminderNow)

export default router
