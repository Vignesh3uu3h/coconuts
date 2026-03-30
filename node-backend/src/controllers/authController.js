import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User, Agent } from '../models/index.js'

dotenv.config()

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error('Server auth configuration missing (JWT_SECRET).')
    error.status = 500
    throw error
  }
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const register = async (req, res) => {
  try {
    const { username, email, password, role, phone } = req.body
    const existing = await User.findOne({ where: { username } })
    if (existing) return res.status(400).json({ error: 'Username already taken.' })

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({ username, email, password: hashedPassword, role, phone })

    if (role === 'agent') {
      await Agent.create({ userId: user.id, name: username, phone: phone || '' })
    }

    return res.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role, phone: user.phone })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ where: { username } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' })
    const token = createToken(user)
    return res.json({ access: token, user: { id: user.id, username: user.username, role: user.role, phone: user.phone } })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
