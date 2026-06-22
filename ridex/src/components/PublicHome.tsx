'use client'
import React, { useState } from 'react'
import HeroSection from './HeroSection'
import VehicleSlider from './VehicleSlider'
import AuthModel from './AuthModel'

const PublicHome = () => {
    const [authOpen,setAuthOpen] = useState(false)
  return (
    <div>
      <HeroSection onAuthRequired={()=>setAuthOpen(true)} />
      <VehicleSlider/>
      <AuthModel open={authOpen} onClose={()=>setAuthOpen(false)}/>
    </div>
  )
}

export default PublicHome
