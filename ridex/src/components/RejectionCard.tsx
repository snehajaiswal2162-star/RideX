'use client'
import { AlertTriangle } from 'lucide-react'
import React from 'react'

const RejectionCard = ({title,reason,onAction,actionLabel}:any) => {
  return (
    <div className='bg-red-50 border border-red-200 rounded-2xl md:rounded-3xl space-y-4 p-5 sm:p-6 md:p-8'>
      <div className="flex items-center gap-2 text-red-600 font-semibold text-sm sm:text-base"><AlertTriangle size={18} />{title}</div>
      <div className="bg-white border rounded-xl p-4 text-sm sm:text-base">{reason}</div>
      {onAction && 
      <button 
      onClick={onAction}
      className='px-6 y-2.5 bg-black text-white rounded-xl text-sm sm:text-base font-medium hover:bg-gray-800 transition cursor-pointer'
      >{actionLabel || 'retry'}</button>
      }
    </div>
  )
}

export default RejectionCard
