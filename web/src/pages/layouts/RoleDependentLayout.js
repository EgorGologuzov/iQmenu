import React from 'react'
import OwnerLayout from './OwnerLayout'
import GeneralLayout from './GeneralLayout'
import { CURRENT_TEST_ROLE, ROLES } from '../../values/roles'

function RoleDependentLayout() {
  const userRole = CURRENT_TEST_ROLE;
  if (userRole === ROLES.OWNER.NAME)
    return <OwnerLayout />
  else
    return <GeneralLayout />
}

export default RoleDependentLayout