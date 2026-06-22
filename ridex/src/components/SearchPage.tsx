'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, number } from "motion/react"
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from "next/dynamic";

const SearchMap = dynamic(
  () => import("@/components/SearchMap"),
  { ssr: false }
);
import { ArrowLeft, MapPin, Navigation, Bike, Car, Truck, Zap, Search, RefreshCcw } from 'lucide-react'
import axios from 'axios'
import { IVehicle, vehicleType } from '@/models/VehicleModel'
import VehicleCard from '@/components/VehicleCard'

const VEHICLE_META: any = {
  bike: { label: "Bike", Icon: Bike },
  auto: { label: "Auto", Icon: Car },
  car: { label: "Car", Icon: Car },
  loading: { label: "Loading", Icon: Truck },
  truck: { label: "Truck", Icon: Truck },

}

const Page = () => {
  const router = useRouter()

  const params = useSearchParams()
  const [pickup, setPickup] = useState(params.get('pickup') || '')
  const [drop, setDrop] = useState(params.get('drop') || '')
  const [km, setKm] = useState<number>(0)

  const vehicle = params.get('vehicle')
  const mobile = params.get('mobile')

  const pickupLat = Number(params.get('pickupLat'))
  const pickupLon = Number(params.get('pickupLon'))
  const dropLat = Number(params.get('dropLat'))
  const dropLon = Number(params.get('dropLon'))

  const [vehicles, setVehicles] = useState<IVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const meta = vehicle ? VEHICLE_META[vehicle] : null

  const getNearByVehicle = async (longitude: number, latitude: number, vehicleType: string | null) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/vehicles/near-by', { longitude, latitude, vehicleType })
      setVehicles(data)
      setLoading(false)
      console.log({
  longitude,
  latitude,
  vehicleType
})
      console.log(data)
    } catch (error:any) {
      console.log(error.response.data.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    getNearByVehicle(pickupLon, pickupLat, vehicle)
  }, [pickupLon, pickupLat])



  return (
    <div className='text-zinc-900 bg-zinc-100 min-h-screen overflow-x-hidden'>
      <div className='top-5 left-5 absolute z-50'>
        <motion.div
          whileTap={{ scale: 0.88 }}
          onClick={() => router.back()}
          className='w-11 h-11 flex items-center justify-center rounded-full bg-white border border-zinc-300 cursor-pointer shadow-md hover:bg-zinc-50 transition-colors'
        >
          <ArrowLeft size={20} className="text-zinc-800" />
        </motion.div>
      </div>

      <div className="relative h-[52px] z-0 w-full">
        <SearchMap
          pickup={pickup}
          drop={drop}
          onChange={(p: string, d: string) => { setPickup(p), setDrop(d) }}
          onDistance={setKm}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 65 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className='relative -mt-10 z-20 bg-white rounded-t-[30px] border-t border-zinc-200 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] pt-5 pb-20 min-h-[52vh] top-80'
      >
        <div className='px-5 lg:px-8 max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden mb-5'
          >
            {/* pickup */}
            <div className='flex px-4 py-3 border-b border-zinc-300'>
              <div className='flex flex-col items-center pt-1.5 shrink-0'>
                <div className='w-2.5 h-2.5 rounded-full bg-zinc-900' />
                <div className='w-px flex-1 bg-zinc-400 my-1 ' style={{ minHeight: 14 }} />
              </div>

              <div className='min-w-0 flex-1'>
                <p className='text-[15px] text-zinc-400 uppercase tracking-windest font-semibold mb-1 pl-5'>PickUp</p>
                <p className='text-sm text-zinc-900 font-semibolf leading-sung truncate pl-5'>{pickup || "-"}</p>
              </div>
              <MapPin size={25} className='text-zinc-400 shrink-0 mt-1.5' />
            </div>

            {/* drop */}
            <div className='flex px-4 py-3 border-b border-zinc-300'>
              <div className='flex flex-col items-center pt-1.5 shrink-0'>
                <div className='w-2.5 h-2.5 rounded-full bg-zinc-900' />
              </div>

              <div className='min-w-0 flex-1'>
                <p className='text-[15px] text-zinc-400 uppercase tracking-windest font-semibold mb-1 pl-5'>Drop</p>
                <p className='text-sm text-zinc-900 font-semibolf leading-sung truncate pl-5'>{drop || "-"}</p>
              </div>
              <Navigation size={25} className='text-zinc-400 shrink-0 mt-1.5' />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='flex items-center justify-between mb-5'
          >
            <div>
              <h2 className='text-lg font-black tracking-tight text-zinc-900 '>
                {loading ? "Finding Vehicles" : vehicles.length > 0 ? "Available" : "No Nearby Vehicles"}
              </h2>
              {meta && <div className='text-zinc-400 text-sm mt-1'>
                {meta.label} rides near your pickup
              </div>}
            </div>

            <AnimatePresence>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  className='flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-full'
                >
                  <div className='w-2.5 h-2.5 rounded-full border-2 border-zinc-300 border-t-zinc-700 animate-spin' />
                  <span className='text-zinc-500 text-xs font-semibold'>Searching...</span>
                </motion.div>
              )
                : vehicles.length > 0 ? (
                  <motion.div
                    key="live"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full'
                  >
                    <Zap className='text-emerald-600 fill-emerald-600' size={11} />
                    <span className='text-emerald-700 text-xs font-bold'>Live</span>
                  </motion.div>
                ) : null
              }
            </AnimatePresence>

           
          </motion.div>
           <AnimatePresence>
              {!loading && vehicles.length==0 && (
                <motion.div
                initial={{opacity:0, y:16}}
                animate={{opacity:1, y:0}}
                exit={{opacity:0}}
                className='flex flex-col items-center justify-center py-14 text-center'
                >
                  <div className='w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4'>
                    <Search className='text-zinc-400 ' size={28} />
                  </div>
                  <p className='text-zinc-900 font-bold text-base mb-1'>Vehicles Not Found</p>
                  <p className='text-zinc-400 text-sm leading-relaxed max-w-xs'>{meta?.label || "Vehicles"} drivers are available near your pickup right now.</p>
                  <motion.button
                  whileTap={{scale:0.95}}
                  onClick={()=>getNearByVehicle(pickupLat,pickupLon,vehicle)}
                  className='mt-5 flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer'
                  > <RefreshCcw size={15}/> Retry Searching... </motion.button>
                </motion.div>
              )}
              </AnimatePresence>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
{vehicles.map((v,i)=> {
  console.log("KM:", km)

return (
  <motion.div
  key={i}
  initial={{opacity:0, y:24}}
  animate={{opacity:1, y:0}}
  transition={{delay: i*0.06 , duration:0.38, ease:[0.22,1,0.36,1]}}
  >
    <VehicleCard
    vehicle={v}
    distance={km}
    onBook={()=>{
      const url = new URLSearchParams({
        pickup,
        drop,
        vehicle:v.type,
        vehicleId:String(v._id),
        driverId: String(v.owner),
        fare:String(Math.round(v.baseFare! + (v.pricePerKm!*km))),
        pickupLat:String(pickupLat),
        pickupLon:String(pickupLon),
        dropLat:String(dropLat),
        dropLon:String(dropLon),
        mobile:String(mobile)
      })
      router.push(`/user/checkout?${url}`)
    }}
    />
  </motion.div>
)
})}
</div>
        </div>
      </motion.div>
    </div>
  )
}

export default Page
