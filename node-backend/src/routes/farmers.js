import express from 'express'
import { listFarmers, createFarmer, retrieveFarmer, updateFarmer, deleteFarmer, upcomingCollections } from '../controllers/farmerController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeAgentOrAdmin } from '../middleware/roles.js'

const router = express.Router()
router.use(authenticate, authorizeAgentOrAdmin)
router.get('/', listFarmers)
router.post('/', createFarmer)
router.get('/upcoming', upcomingCollections)
router.get('/:id', retrieveFarmer)
router.put('/:id', updateFarmer)
router.delete('/:id', deleteFarmer)

export default router
