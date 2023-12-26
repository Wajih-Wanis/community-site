import BottomBar from '@/components/shared/BottomBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import TopBar from '@/components/shared/TopBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const _rootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <TopBar/>
      <LeftSideBar/>
      <section className='flex flex-1 h-full'>
        <Outlet/>
      </section>
      <BottomBar/>
    </div>
  )
}

export default _rootLayout
