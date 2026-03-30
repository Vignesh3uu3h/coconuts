import { Purchase, Sale, StockLedger } from '../models/index.js'
import dayjs from 'dayjs'

export const dashboardSummary = async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD')
    const todayPurchaseQty = await Purchase.sum('numberOfCoconuts', { where: { date: today } }) || 0
    const todayPurchaseAmount = await Purchase.sum('totalAmount', { where: { date: today } }) || 0
    const todaySales = await Sale.sum('totalAmount', { where: { date: today } }) || 0
    const totalIn = await StockLedger.sum('quantity', { where: { type: 'IN' } }) || 0
    const totalOut = await StockLedger.sum('quantity', { where: { type: 'OUT' } }) || 0
    return res.json({
      today_purchase_qty: todayPurchaseQty,
      today_purchases: todayPurchaseAmount,
      today_sales: todaySales,
      current_stock: totalIn - totalOut,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
