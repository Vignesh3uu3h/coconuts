import { Purchase, Sale, StockLedger } from '../models/index.js'
import { Op } from 'sequelize'
import dayjs from 'dayjs'

export const dashboardSummary = async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD')
    const startMonth = dayjs().startOf('month').format('YYYY-MM-DD')

    const todayPurchases = await Purchase.sum('totalAmount', { where: { date: today } }) || 0
    const todaySales = await Sale.sum('totalAmount', { where: { date: today } }) || 0
    const totalIn = await StockLedger.sum('quantity', { where: { type: 'IN' } }) || 0
    const totalOut = await StockLedger.sum('quantity', { where: { type: 'OUT' } }) || 0
    const monthlyPurchase = await Purchase.sum('totalAmount', { where: { date: { [Op.gte]: startMonth } } }) || 0
    const monthlySale = await Sale.sum('totalAmount', { where: { date: { [Op.gte]: startMonth } } }) || 0
    return res.json({
      today_purchases: todayPurchases,
      today_sales: todaySales,
      current_stock: totalIn - totalOut,
      monthly_profit: monthlySale - monthlyPurchase,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
