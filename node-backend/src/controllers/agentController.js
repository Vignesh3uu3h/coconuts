import { Agent, Farmer } from '../models/index.js'

export const listAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll()
    return res.json(agents)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body)
    return res.status(201).json(agent)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const retrieveAgent = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id, { include: [{ model: Farmer, as: 'farmers' }] })
    if (!agent) return res.status(404).json({ error: 'Agent not found.' })
    return res.json(agent)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id)
    if (!agent) return res.status(404).json({ error: 'Agent not found.' })
    await agent.update(req.body)
    return res.json(agent)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id)
    if (!agent) return res.status(404).json({ error: 'Agent not found.' })
    await agent.destroy()
    return res.status(204).send()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
