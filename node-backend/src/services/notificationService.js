import dayjs from 'dayjs'
import { Op } from 'sequelize'
import { Farmer, Notification, Agent } from '../models/index.js'
import { sendMockMessage } from './messageService.js'

const buildReminderMessage = (farmer) => {
  const dueDate = farmer.nextSupplyDate || 'N/A'
  const village = farmer.village || 'N/A'
  const phone = farmer.phone || 'N/A'
  return `Reminder: Farmer ${farmer.name} from ${village} is due for coconut supply on ${dueDate}. Contact: ${phone}.`
}

export const generateFarmerDueNotifications = async () => {
  const today = dayjs().format('YYYY-MM-DD')
  const dueFarmers = await Farmer.findAll({
    where: {
      nextSupplyDate: { [Op.lte]: today },
    },
    include: [{ model: Agent, as: 'assignedAgent' }],
  })

  let createdCount = 0

  for (const farmer of dueFarmers) {
    if (!farmer.assignedAgentId) continue
    const existing = await Notification.findOne({
      where: {
        agentId: farmer.assignedAgentId,
        farmerId: farmer.id,
        reminderDate: farmer.nextSupplyDate,
      },
    })
    if (existing) continue

    const message = buildReminderMessage(farmer)
    const notification = await Notification.create({
      agentId: farmer.assignedAgentId,
      farmerId: farmer.id,
      message,
      reminderDate: farmer.nextSupplyDate,
      status: 'pending',
    })

    const sent = await sendMockMessage({
      agent: farmer.assignedAgent,
      farmer,
      message,
    })

    if (sent) {
      await notification.update({ status: 'sent' })
    }

    createdCount += 1
  }

  return { createdCount, checkedFarmers: dueFarmers.length }
}
