'use client'
import React from 'react'
import { motion } from 'motion/react'
const TabButton = ({ active, count, icon, onClick, children }:any) => {
  return (
    <motion.div
    onClick={onClick}
    whileTap={{ scale:1.7 }}
    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 selct-none 
        ${active ? "bg-neutral-900 text-white shadow-lg shadow-black/30" : "text-black  hover:bg-gray-100 hover:text-gray-800"}`}
    >
      <span className={`flex items-center ${active ? "text-white" : "text-gray-500"}`}>{icon}</span>
      <span className="hidden sm:inline">{children}</span>
      <span
      className={`min-w-[22px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center transition-all 
        ${active 
            ? "bg-white text-black"
            : count > 0
                ? "bg-red-500 text-white"
                : "bg-gray-300 text-gray-600"
        }
        `}
      >{count}</span>
    </motion.div>
  )
}

export default TabButton
