export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' })
  }
  next()
}

export const authorizeAgentOrAdmin = (req, res, next) => {
  if (!['admin', 'agent'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied.' })
  }
  next()
}
