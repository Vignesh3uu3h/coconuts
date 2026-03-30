import { Buyer } from '../models/index.js'

export const listBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.findAll()
    return res.json(buyers)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const createBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body)
    return res.status(201).json(buyer)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const retrieveBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByPk(req.params.id)
    if (!buyer) return res.status(404).json({ error: 'Buyer not found.' })
    return res.json(buyer)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const updateBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByPk(req.params.id)
    if (!buyer) return res.status(404).json({ error: 'Buyer not found.' })
    await buyer.update(req.body)
    return res.json(buyer)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const deleteBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByPk(req.params.id)
    if (!buyer) return res.status(404).json({ error: 'Buyer not found.' })
    await buyer.destroy()
    return res.status(204).send()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
