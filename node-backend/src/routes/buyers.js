import express from 'express'
import { listBuyers, createBuyer, retrieveBuyer, updateBuyer, deleteBuyer } from '../controllers/buyerController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeAgentOrAdmin } from '../middleware/roles.js'

const router = express.Router()
router.use(authenticate, authorizeAgentOrAdmin)
router.get('/', listBuyers)
router.post('/', createBuyer)
router.get('/:id', retrieveBuyer)
router.put('/:id', updateBuyer)
router.delete('/:id', deleteBuyer)

export default router
