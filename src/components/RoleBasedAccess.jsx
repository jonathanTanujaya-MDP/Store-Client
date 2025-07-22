import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const RoleBasedAccess = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  const userRole = user.role;
  const hasAccess = allowedRoles.includes(userRole);

  return hasAccess ? children : fallback;
};

// Specific components for common role checks
export const OwnerOnly = ({ children, fallback = null }) => (
  <RoleBasedAccess allowedRoles={['owner']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const AdminOrOwner = ({ children, fallback = null }) => (
  <RoleBasedAccess allowedRoles={['admin', 'owner']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export default RoleBasedAccess;
