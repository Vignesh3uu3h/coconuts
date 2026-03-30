import { Purchase, Sale, StockLedger } from '../models/index.js'
import dayjs from 'dayjs'

export const dashboardSummary = async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD')
    const [todayPurchaseQty, todayPurchaseAmount, todaySales, totalIn, totalOut] = await Promise.all([
      Purchase.sum('numberOfCoconuts', { where: { date: today } }),
      Purchase.sum('totalAmount', { where: { date: today } }),
      Sale.sum('totalAmount', { where: { date: today } }),
      StockLedger.sum('quantity', { where: { type: 'IN' } }),
      StockLedger.sum('quantity', { where: { type: 'OUT' } }),
    ])
    return res.json({
      today_purchase_qty: todayPurchaseQty || 0,
      today_purchases: todayPurchaseAmount || 0,
      today_sales: todaySales || 0,
      current_stock: (totalIn || 0) - (totalOut || 0),
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
