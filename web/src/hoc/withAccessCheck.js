import React from 'react'
import { CURRENT_TEST_ROLE, ROLES } from '../values/roles';
import E403 from '../components/errors/E403'

function withAccessCheck(element, allowedUserRoles) {
  return function(props) {
    const userRole = CURRENT_TEST_ROLE;
    if (allowedUserRoles.includes && allowedUserRoles.includes(userRole))
      return element(props)
    else
      return <E403 />
  }
}

export default withAccessCheck