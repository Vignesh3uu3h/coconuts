import { Sale, Buyer, StockLedger } from '../models/index.js'
import { sequelize } from '../config/db.js'

const getCurrentStock = async () => {
  const result = await StockLedger.findAll({ attributes: [[sequelize.fn('SUM', sequelize.col('quantity')), 'total']], where: { type: 'IN' } })
  const totalIn = parseInt(result[0].get('total') || 0, 10)
  const resultOut = await StockLedger.findAll({ attributes: [[sequelize.fn('SUM', sequelize.col('quantity')), 'total']], where: { type: 'OUT' } })
  const totalOut = parseInt(resultOut[0].get('total') || 0, 10)
  return totalIn - totalOut
}

export const listSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      attributes: ['id', 'date', 'coconutsSold', 'pricePerCoconut', 'totalAmount', 'paymentStatus', 'transportNotes', 'buyerId'],
      include: [{ model: Buyer, as: 'buyer', attributes: ['id', 'businessName', 'phone', 'location'] }],
      order: [['date', 'DESC'], ['id', 'DESC']],
      limit: 300,
    })
    return res.json(sales)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const createSale = async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    const { buyerId, date, coconutsSold, pricePerCoconut, paymentStatus, transportNotes } = req.body
    const buyer = await Buyer.findByPk(buyerId)
    if (!buyer) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Buyer not found.' })
    }
    const currentStock = await getCurrentStock()
    if (coconutsSold > currentStock) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Insufficient warehouse stock.' })
    }
    const sale = await Sale.create({ buyerId, date, coconutsSold, pricePerCoconut, paymentStatus, transportNotes }, { transaction })
    await StockLedger.create({ type: 'OUT', quantity: coconutsSold, referenceType: 'sale', referenceId: sale.id, saleId: sale.id }, { transaction })
    await transaction.commit()
    return res.status(201).json(sale)
  } catch (err) {
    await transaction.rollback()
    return res.status(500).json({ error: err.message })
  }
}

export const retrieveSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, { include: ['buyer'] })
    if (!sale) return res.status(404).json({ error: 'Sale not found.' })
    return res.json(sale)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
