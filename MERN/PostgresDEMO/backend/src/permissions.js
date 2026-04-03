// src/permissions.js

const permissions = {
  USER: [
    'read:own_profile',
    'update:own_profile',
    'create:post',
    'read:post',
    'update:own_post',
    'delete:own_post'
  ],
  MODERATOR: [
    'read:own_profile',
    'update:own_profile',
    'create:post',
    'read:post',
    'update:own_post',
    'delete:own_post',
    'delete:any_post',    // extra — can delete anyone's post
    'read:any_user'       // extra — can view any user profile
  ],
  ADMIN: [
    'read:own_profile',
    'update:own_profile',
    'create:post',
    'read:post',
    'update:own_post',
    'delete:own_post',
    'delete:any_post',
    'read:any_user',
    'update:any_user',    // extra — can update any user
    'delete:any_user',    // extra — can delete any user
    'manage:roles',       // extra — can change user roles
    'read:audit_logs'     // extra — can view audit trail
  ]
}

// Check if a role has a specific permission
function can(role, permission) {
  return permissions[role]?.includes(permission) ?? false
}

module.exports = { permissions, can }