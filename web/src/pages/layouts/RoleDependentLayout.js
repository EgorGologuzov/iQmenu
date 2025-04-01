import React from 'react'
import OwnerLayout from './OwnerLayout'
import GeneralLayout from './GeneralLayout'
import { ROLES } from '../../values/roles'

function RoleDependentLayout() {
  const userRole = ROLES.OWNER.NAME;
  if (userRole === ROLES.OWNER.NAME)
    return <OwnerLayout />
  else
    return <GeneralLayout />
}

export default RoleDependentLayout