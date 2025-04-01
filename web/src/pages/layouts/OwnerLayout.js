import React from 'react'
import { Outlet } from 'react-router'
import withAccessCheck from '../../hoc/withAccessCheck'
import { ROLES } from '../../values/roles'

function OwnerLayout() {
  return (
    <div>
      OwnerLayout
      <Outlet />
    </div>
  )
}

export default withAccessCheck(OwnerLayout, [ROLES.OWNER.NAME])