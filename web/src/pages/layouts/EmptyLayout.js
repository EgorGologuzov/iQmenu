import React from 'react'
import { Outlet } from 'react-router'

function EmptyLayout() {
  return (
    <div className='empty-layout'>
      <Outlet />
    </div>
  )
}

export default EmptyLayout