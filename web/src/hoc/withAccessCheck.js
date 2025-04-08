import React from 'react'
import E403 from '../components/errors/E403'
import { useSelector } from 'react-redux';

function withAccessCheck(element, allowedUserRoles) {
  return function(props) {
    const userRole = useSelector(state => state.user.role);
    return allowedUserRoles.includes && allowedUserRoles.includes(userRole) ? element(props) : <E403 />;
  }
}

export default withAccessCheck