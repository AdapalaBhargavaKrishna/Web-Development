// src/routes/users.js
const express = require('express')
const prisma  = require('../db')
const { isAuthenticated, hasPermission, isOwnerOrAdmin } = require('../middleware/auth')

const router = express.Router()

// Simulate logged in user (in real app this comes from JWT)
router.use((req, res, next) => {
  req.user = { id: 1, role: 'USER' }   // change role to test
  next()
})

// GET /users — only ADMIN and MODERATOR can list all users
router.get('/',
  isAuthenticated,
  hasPermission('read:any_user'),
  async (req, res) => {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, email: true, role: true }
    })
    res.json(users)
  }
)

// GET /users/:id — users can only see their own, admins see all
router.get('/:id',
  isAuthenticated,
  isOwnerOrAdmin(async (req) => {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) }
    })
    return user?.id
  }),
  async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, name: true, email: true, role: true }
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  }
)

// PUT /users/:id — users update own profile, admins update anyone
router.put('/:id',
  isAuthenticated,
  isOwnerOrAdmin(async (req) => Number(req.params.id)),
  async (req, res) => {
    const { name, email } = req.body
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { name, email }
    })
    res.json(user)
  }
)

// DELETE /users/:id — only ADMIN can delete users
router.delete('/:id',
  isAuthenticated,
  hasPermission('delete:any_user'),
  async (req, res) => {
    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { deletedAt: new Date() }   // soft delete
    })
    res.json({ message: 'User deleted' })
  }
)

// PATCH /users/:id/role — only ADMIN can change roles
router.patch('/:id/role',
  isAuthenticated,
  hasPermission('manage:roles'),
  async (req, res) => {
    const { role } = req.body

    if (!['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { role }
    })
    res.json(user)
  }
)

module.exports = router