import express from 'express'
import { listSales, createSale, retrieveSale } from '../controllers/saleController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeAgentOrAdmin } from '../middleware/roles.js'

const router = express.Router()
router.use(authenticate, authorizeAgentOrAdmin)
router.get('/', listSales)
router.post('/', createSale)
router.get('/:id', retrieveSale)

export default router
