import dayjs from 'dayjs'
import { Op } from 'sequelize'
import { Farmer, Notification, Agent } from '../models/index.js'
import { sendReminderMessage } from './messageService.js'

const CHECK_INTERVAL_MS = 5 * 60 * 1000
let lastRunAt = 0
let runningJob = null

const buildReminderMessage = (farmer) => {
  const dueDate = farmer.nextSupplyDate || 'N/A'
  const village = farmer.village || 'N/A'
  const phone = farmer.phone || 'N/A'
  return `Reminder: Farmer ${farmer.name} from ${village} is due for coconut supply on ${dueDate}. Contact: ${phone}.`
}

export const generateFarmerDueNotifications = async ({ force = false } = {}) => {
  const now = Date.now()
  if (!force && now - lastRunAt < CHECK_INTERVAL_MS) {
    return { createdCount: 0, checkedFarmers: 0, skipped: true }
  }

  if (runningJob) {
    return runningJob
  }

  runningJob = (async () => {
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

    const sendResult = await sendReminderMessage({
      agent: farmer.assignedAgent,
      farmer,
      message,
    })

    if (sendResult.success) {
      await notification.update({ status: 'sent' })
    } else {
      console.error(`Reminder not sent for farmer ${farmer.id}: ${sendResult.error || 'unknown error'}`)
    }

    createdCount += 1
  }

    return { createdCount, checkedFarmers: dueFarmers.length, skipped: false }
  })()

  try {
    const result = await runningJob
    lastRunAt = Date.now()
    return result
  } finally {
    runningJob = null
  }
}

export const generateFarmerDueNotificationsInBackground = () => {
  generateFarmerDueNotifications().catch((error) => {
    console.error('Background reminder generation failed:', error.message)
  })
}
