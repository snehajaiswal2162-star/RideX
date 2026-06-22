'use client'
import React from 'react'
import { IVehicle } from '@/models/VehicleModel'
import vehicleModel from '@/models/VehicleModel'
import { motion } from 'motion/react'
import { Bike, Car, Truck, Star, IndianRupee, Gauge, Clock, ArrowRight } from 'lucide-react'


const TYPE_CONFIG: any = {
  bike: { label: "Bike", Icon: Bike },
  auto: { label: "Auto", Icon: Car },
  car: { label: "Car", Icon: Car },
  loading: { label: "Loading", Icon: Truck },
  truck: { label: "Truck", Icon: Truck },

}

 type vehicleType = "car" | "bike" | "truck" | "loading" |"auto"


const VehicleCard = ({ vehicle, distance, onBook }: { vehicle: IVehicle, distance: number | undefined,onBook: ()=>void }) => {
  const { Icon, label } = TYPE_CONFIG[vehicle.type]

  let estimated: number = 0
  if (vehicle.baseFare && vehicle.pricePerKm && distance) {
    estimated = Math.round(vehicle.baseFare + vehicle.pricePerKm * distance)
  }

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col cursor-default"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
    >
      <div className='relative h-48 bg-zinc-50 flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        <motion.img
          src={vehicle.imageUrl}
          alt={vehicle.modelName}
          className='relative z-10 h-32 w-full object-contain'
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.14))" }}
          whileHover={{ scale: 1.05, filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.22))' }}
          transition={{ duration: 0.35 }}
        />
        <div className='absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-zinc-900 text-white text-[10px]
        font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full
        '>
          <Icon size={10} />
          {label}
        </div>

        <div className='absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-white border border-zinc-200
          text-zinc-700 text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-sm
          '>
          <Star className='fill-zinc-900 text-zinc-900' size={10} /> 4.7
        </div>
      </div>

      <div className='h-px bg-zinc-100' />
      <div className='flex flex-col flex-1 p-5 gap-4'>
        <div className='flex items-center justify-between gap-4'>
          <div className='min-w-0'>
            <h3 className='text-zinc-900 text-base font-black tracking-tight leading-tight truncate'>{vehicle.modelName}</h3>
            <div className='mt-1 inline-flex items-center bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200'>
              <span className='text-zinc-500 text-xs font-black tracking-[0.2em] font-mono uppercase'>{vehicle.number}</span>
            </div>
          </div>
          <div className='shrink-0 w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center'>
            <Icon size={18} className='text-zinc-600' />
          </div>
        </div>


        <div className='grid grid-cols-2 gap-2'>
          {/* perice per km */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-3.5 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Gauge size={12} className='text-zinc-400' />
              <p className='text-zinc-400 text-[9px] uppercase tracking-widest font-bold'>Per Km</p>
            </div>
            <div className='text-zinc-900 text-sm font-black items-center flex'>
              <IndianRupee size={13} /> {vehicle.pricePerKm}
            </div>
          </div>

          {/* waiting charge */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-3.5 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={12} className='text-zinc-400' />
              <p className='text-zinc-400 text-[9px] uppercase tracking-widest font-bold'>Waiting</p>
            </div>
            <div className='text-zinc-900 text-sm font-black items-center flex'>
              <IndianRupee size={13} /> {vehicle.waitingCharge}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
          <div className='text-zinc-400 text-[9px] uppercase tracking-widest font-bold mb-0.5'>Est Fare</div>
          <motion.div
            key={estimated}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='flex items-center gap-0.5'
          >
            <IndianRupee size={12} className='text-zinc-900 mb-1' strokeWidth={2.5} />
            <span className='text-zinc-900 font-black text-3xl tracking-tight leading-tight'>{estimated}</span>
          </motion.div>
        </div>
         <motion.div
  whileTap={{ scale: 0.96 }}
  whileHover={{ scale: 1.05 }}
  onClick={onBook}
  className="flex items-center justify-between gap-2 bg-zinc-900 hover:bg-black text-white text-sm font-black py-3 px-4 rounded-2xl transition-colors shadow-md cursor-pointer"
>
  Book

  <motion.div
    initial={{ opacity: 0.8, x: 0 }}
    whileHover={{ x: 3 }}
    transition={{ duration: 0.3 }}
  >
    <ArrowRight size={15} className="text-white" />
  </motion.div>
</motion.div>
      </div>
    </motion.div>
  )
}

export default VehicleCard
