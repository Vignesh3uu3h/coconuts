import { Farmer } from '../models/index.js'
import { Op } from 'sequelize'

export const listFarmers = async (req, res) => {
  try {
    const query = {}
    if (req.user.role === 'agent' && req.user.agentProfile) {
      query.assignedAgentId = req.user.agentProfile.id
    }
    const farmers = await Farmer.findAll({ where: query })
    return res.json(farmers)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const createFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body)
    return res.status(201).json(farmer)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const retrieveFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id)
    if (!farmer) return res.status(404).json({ error: 'Farmer not found.' })
    return res.json(farmer)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id)
    if (!farmer) return res.status(404).json({ error: 'Farmer not found.' })
    await farmer.update(req.body)
    return res.json(farmer)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id)
    if (!farmer) return res.status(404).json({ error: 'Farmer not found.' })
    await farmer.destroy()
    return res.status(204).send()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const upcomingCollections = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const farmers = await Farmer.findAll({
      where: {
        nextSupplyDate: {
          [Op.between]: [today, nextWeek],
        },
      },
    })
    return res.json(farmers)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
