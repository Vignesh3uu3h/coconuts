import { StockLedger } from '../models/index.js'
import { sequelize } from '../config/db.js'

export const getStockSummary = async (req, res) => {
  try {
    const totalIn = await StockLedger.sum('quantity', { where: { type: 'IN' } }) || 0
    const totalOut = await StockLedger.sum('quantity', { where: { type: 'OUT' } }) || 0
    return res.json({ total_stock: totalIn - totalOut, total_in: totalIn, total_out: totalOut })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
