import { Notification, Agent, Farmer } from '../models/index.js'
import { generateFarmerDueNotifications } from '../services/notificationService.js'

export const listNotifications = async (req, res) => {
  try {
    await generateFarmerDueNotifications()
    const query = {}
    if (req.user.role === 'agent' && req.user.agentProfile) {
      query.agentId = req.user.agentProfile.id
    }
    const notifications = await Notification.findAll({ where: query, include: ['agent', 'farmer'], order: [['date', 'DESC']] })
    return res.json(notifications)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
