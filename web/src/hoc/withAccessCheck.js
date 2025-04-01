import React from 'react'
import { ROLES } from '../values/roles';
import E403 from '../components/errors/E403'

function withAccessCheck(element, allowedUserRoles) {
  return function(props) {
    const userRole = ROLES.OWNER.NAME;
    if (allowedUserRoles.includes && allowedUserRoles.includes(userRole))
      return element(props)
    else
      return <E403 />
  }
}

export default withAccessCheck