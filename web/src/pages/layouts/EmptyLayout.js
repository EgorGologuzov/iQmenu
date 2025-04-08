import React from 'react'
import { Outlet } from 'react-router'

function EmptyLayout() {
  return (
    <div>
      EmptyLayout
      <Outlet />
    </div>
  )
}

export default EmptyLayout