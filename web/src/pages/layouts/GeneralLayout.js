import React from 'react'
import { Outlet } from 'react-router'
import PageHeader from '../../components/navs/PageHeader'

function GeneralLayout() {
  return (
    <div>
      <PageHeader />
      <Outlet />
    </div>
  )
}

export default GeneralLayout