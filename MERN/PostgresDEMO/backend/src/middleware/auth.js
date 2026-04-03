// src/middleware/auth.js
const { can } = require('../permissions')

// Check if user is authenticated at all
function isAuthenticated(req, res, next) {
  // In real app this would verify a JWT token
  // For now we simulate a logged in user
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  next()
}

// Check if user has a specific permission
function hasPermission(permission) {
  return (req, res, next) => {
    const role = req.user?.role

    if (!role) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (!can(role, permission)) {
      return res.status(403).json({
        error: `Forbidden — requires permission: ${permission}`
      })
    }

    next()
  }
}

// Check if user is accessing their OWN resource
function isOwnerOrAdmin(getResourceOwnerId) {
  return async (req, res, next) => {
    const userId = req.user?.id
    const role   = req.user?.role

    // admins can access anything
    if (role === 'ADMIN') return next()

    // check if user owns this resource
    const ownerId = await getResourceOwnerId(req)

    if (ownerId !== userId) {
      return res.status(403).json({ error: 'Forbidden — not your resource' })
    }

    next()
  }
}

module.exports = { isAuthenticated, hasPermission, isOwnerOrAdmin }