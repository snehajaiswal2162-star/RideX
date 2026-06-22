'use client'
import React from 'react'
import { motion } from 'motion/react'

const StatusCard = ({icon,title,desc}:any) => {
  return (
    <motion.div
    initial={{opacity:0, y:20}}
    animate={{opacity:1, y:0}}
    className='bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 space-y-5 shadow-lg flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center mt-10'
    >
      <div className='bg-black text-white p-3 md:p-4 rounded-xl shrink-0 mt-5'>{icon}</div>
      <div className="flex-1">
        <h2 className='text-black font-semibold text-base sm:text-lg md:text-xl '>{title}</h2>
        <p className='text-gray-600 text-sm sm:text-base mt-1'>{desc}</p>
      </div>
    </motion.div>
  )
}

export default StatusCard
