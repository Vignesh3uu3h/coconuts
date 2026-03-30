import { Notification, Agent, Farmer } from '../models/index.js'
import { generateFarmerDueNotificationsInBackground } from '../services/notificationService.js'

export const listNotifications = async (req, res) => {
  try {
    generateFarmerDueNotificationsInBackground()
    const query = {}
    if (req.user.role === 'agent' && req.user.agentProfile) {
      query.agentId = req.user.agentProfile.id
    }
    const notifications = await Notification.findAll({
      where: query,
      include: [
        { model: Agent, as: 'agent', attributes: ['id', 'name', 'phone'] },
        { model: Farmer, as: 'farmer', attributes: ['id', 'name', 'village'] },
      ],
      order: [['date', 'DESC']],
      limit: 100,
    })
    return res.json(notifications)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
