import express from 'express'
import { listPurchases, createPurchase, retrievePurchase } from '../controllers/purchaseController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeAgentOrAdmin } from '../middleware/roles.js'

const router = express.Router()
router.use(authenticate, authorizeAgentOrAdmin)
router.get('/', listPurchases)
router.post('/', createPurchase)
router.get('/:id', retrievePurchase)

export default router
