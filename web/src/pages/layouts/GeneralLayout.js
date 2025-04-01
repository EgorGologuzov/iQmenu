import React from 'react'
import { Outlet } from 'react-router'

function GeneralLayout() {
  return (
    <div>
      GeneralLayout
      <Outlet />
    </div>
  )
}

export default GeneralLayout