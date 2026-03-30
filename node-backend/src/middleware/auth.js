import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User, Agent } from '../models/index.js'

dotenv.config()

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(payload.id, { include: [{ model: Agent, as: 'agentProfile' }] })
    if (!user) return res.status(401).json({ error: 'Invalid token.' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}
