import { Purchase, Farmer, StockLedger, Agent, sequelize } from '../models/index.js'

export const listPurchases = async (req, res) => {
  try {
    const query = {}
    if (req.user.role === 'agent' && req.user.agentProfile) {
      query.agentId = req.user.agentProfile.id
    }
    const purchases = await Purchase.findAll({
      where: query,
      attributes: ['id', 'date', 'numberOfCoconuts', 'pricePerCoconut', 'totalAmount', 'paymentStatus', 'notes', 'farmerId', 'agentId'],
      include: [
        { model: Farmer, as: 'farmer', attributes: ['id', 'name', 'village'] },
        { model: Agent, as: 'agent', attributes: ['id', 'name', 'phone'] },
      ],
      order: [['date', 'DESC'], ['id', 'DESC']],
      limit: 300,
    })
    return res.json(purchases)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const createPurchase = async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    const { farmerId, agentId, numberOfCoconuts, pricePerCoconut, date, paymentStatus, notes } = req.body
    const farmer = await Farmer.findByPk(farmerId)
    const agent = await Agent.findByPk(agentId)
    if (!farmer || !agent) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Farmer or agent not found.' })
    }
    const purchase = await Purchase.create({ farmerId, agentId, numberOfCoconuts, pricePerCoconut, date, paymentStatus, notes }, { transaction })
    await StockLedger.create({ type: 'IN', quantity: numberOfCoconuts, referenceType: 'purchase', referenceId: purchase.id, purchaseId: purchase.id }, { transaction })
    await farmer.update({ lastSupplyDate: date }, { transaction })
    await transaction.commit()
    return res.status(201).json(purchase)
  } catch (err) {
    await transaction.rollback()
    return res.status(500).json({ error: err.message })
  }
}

export const retrievePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id, { include: ['farmer', 'agent'] })
    if (!purchase) return res.status(404).json({ error: 'Purchase not found.' })
    return res.json(purchase)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
