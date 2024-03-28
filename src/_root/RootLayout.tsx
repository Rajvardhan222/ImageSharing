import { useUserContext } from '@/context/AuthContext'
import BottomBar from '@/shared/BottomBar'
import LeftSideBar from '@/shared/LeftSideBar'
import TopBar from '@/shared/TopBar'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

function RootLayout() {
  let navigate = useNavigate()
  const { isAuthenticated } = useUserContext();
  
  useEffect(()=>{
    
  if(!isAuthenticated){
    navigate('/sign-in')
  }
  },[navigate])
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

export default RootLayout