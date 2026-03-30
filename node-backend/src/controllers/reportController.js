import { Agent, Farmer, Purchase, Sale } from '../models/index.js'
import { Op } from 'sequelize'
import dayjs from 'dayjs'

const groupByMonth = (rows) => {
  const groups = {}
  rows.forEach((row) => {
    const month = dayjs(row.date).format('YYYY-MM')
    groups[month] = (groups[month] || 0) + parseFloat(row.totalAmount)
  })
  return Object.entries(groups).map(([month, total]) => ({ month, total }))
}

export const monthlyReport = async (req, res) => {
  try {
    const startYear = dayjs().startOf('year').format('YYYY-MM-DD')
    const purchases = await Purchase.findAll({ where: { date: { [Op.gte]: startYear } } })
    const sales = await Sale.findAll({ where: { date: { [Op.gte]: startYear } } })
    return res.json({ purchases: groupByMonth(purchases), sales: groupByMonth(sales) })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const agentReport = async (req, res) => {
  try {
    const agents = await Agent.findAll({ include: [{ model: Farmer, as: 'farmers' }] })
    const data = agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      phone: agent.phone,
      farmerCount: agent.farmers.length,
    }))
    return res.json({ agents: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const farmerReport = async (req, res) => {
  try {
    const farmers = await Farmer.findAll({ include: [{ model: Agent, as: 'assignedAgent', attributes: ['name'] }] })
    return res.json({ farmers })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
