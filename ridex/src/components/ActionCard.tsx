'use client'
import React from 'react'

const ActionCard = ({icon, title, button, onClick}:any) => {
  return (
    <div className='bg-white space-y-4 rounded-2xl md:rounded-3xl p-4 md:p-8 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg gap-5 mt-10'>
      <div className="flex items-center gap-4">
        <div className='bg-black text-white rounded-xl shrink-0p-3 sm:p-4'>{icon}</div>
        <div className='text-base sm:text-lg md:text-xl font-semibold'>{title}</div>
      </div>

      <button
      className='w-full sm:w-auto bg-black text-white px-6 py-2.5 rounded-xl text-sm sm:text-base font-medium transition hover:bg-gray-800 cursor-pointer' 
      onClick={onClick}
      >{button}</button>
    </div>
  )
}

export default ActionCard
