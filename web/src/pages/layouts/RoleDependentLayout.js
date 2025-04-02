import React from 'react'
import OwnerLayout from './OwnerLayout'
import GeneralLayout from './GeneralLayout'
import { ROLES } from '../../values/roles'
import { useSelector } from 'react-redux';

function RoleDependentLayout() {
  const userRole = useSelector(state => state.user.role);
  switch (userRole) {
    case ROLES.OWNER.NAME: return <OwnerLayout />;
    default: return <GeneralLayout />;
  }
}

export default RoleDependentLayout