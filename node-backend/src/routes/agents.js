import express from 'express'
import { listAgents, createAgent, retrieveAgent, updateAgent, deleteAgent } from '../controllers/agentController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeAgentOrAdmin } from '../middleware/roles.js'

const router = express.Router()
router.use(authenticate, authorizeAgentOrAdmin)
router.get('/', listAgents)
router.post('/', createAgent)
router.get('/:id', retrieveAgent)
router.put('/:id', updateAgent)
router.delete('/:id', deleteAgent)

export default router
