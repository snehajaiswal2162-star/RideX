'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { vehicleType } from '@/models/VehicleModel'
import { Bike, Car, Truck, Phone, MapPin, LocateFixed, ChevronRight, Navigation, Loader } from "lucide-react";
import axios from 'axios'

const varientStep = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const VEHICLES = [
  { id: "bike", label: "Bike", Icon: Bike, desc: "Quick & affordable" },
  { id: "auto", label: "Auto", Icon: Car, desc: "Everyday rides" },
  { id: "car", label: "Car", Icon: Car, desc: "Comfort rides" },
  { id: "loading", label: "Loading", Icon: Truck, desc: "Small cargo" },
  { id: "truck", label: "Truck", Icon: Truck, desc: "Heavy transport" },
];

type Place = {
  lng(lng: any): unknown
  id: string,
  name: string,
  city?: string,
  state?: string,
  country?: string,
  countryCode?: string,
  lat?: number,
  lon?: number
}

const Page = () => {
  const router = useRouter()

  const [vehicle, setVehicle] = useState<vehicleType>()
  const [mobile, setMobile] = useState("")
  const [pickup, setPickup] = useState("")
  const [drop, setDrop] = useState("")

  const [pickupCountry, setPickupCountry] = useState("")
  const [pickupLat, setPickupLat] = useState<number>()
  const [pickupLon, setPickupLon] = useState<number>()
  const [pickupSuggestions, setPickUpSuggestions] = useState<Place[]>([])

  const [dropCountry, setDropCountry] = useState("")
  const [dropLat, setDropLat] = useState<number>()
  const [dropLon, setDropLon] = useState<number>()
  const [dropSuggestions, setDropSuggestions] = useState<Place[]>([])

  const [locating, setLocating] = useState(false)
  const [loading, setLoading] = useState(false)

  const progress = [!!vehicle, !!(mobile.length == 10), !!pickup, !!drop].filter(Boolean).length

  const canCountinue = !!(vehicle && mobile && pickup && drop && pickupLat && pickupLon && dropLat && dropLon

  )

  const currentLocation = () => {
    setLoading(true)
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const { data } = await axios.get('https://api.geoapify.com/v1/geocode/reverse',
          {
            params: {
              lat: coords.latitude,
              lon: coords.longitude,
              apiKey: process.env.NEXT_PUBLIC_SOCKET_GEOAPIFY_API_KEY,
              // filter:'countrycode:in'
            }
          }
        )
        if (data?.features?.length) {
          const p = data.features[0].properties
          const address = [p.name, p.street, p.city, p.country].filter(Boolean).join(",")
          setPickup(address)
          setPickupCountry(p.country)
          setPickupLat(coords.latitude)
          setPickupLon(coords.longitude)
          setPickUpSuggestions([])
          setLocating(false)
          setLoading(false)
        }
      } catch (err) {
        console.log(err)
        setLocating(false)
        setLoading(false)
      }
    })
  }

  const sreachAddress = async (q: string, setResults: (r: Place[]) => void, restrict?: string | null) => {
    setLoading(true)
    try {
      if (!q || q.trim().length < 3) {
        setResults([])
        return
      }
      const { data } = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
        params: {
          text: q.trim(),
          apiKey: process.env.NEXT_PUBLIC_SOCKET_GEOAPIFY_API_KEY,
          filter: 'countrycode:in',
          limit: 5
        }
      })
      console.log(data)
      let result: Place[] = (data.features ?? []).map((f: any) => ({
        id: String(f.properties.osm_id),
        name: f.properties.name,
        city: f.properties.city,
        state: f.properties.state,
        country: f.properties.country,
        lat: f.geometry?.coordinates?.[1],
        lon: f.geometry?.coordinates?.[0],
      }))
      if (restrict) {
        result = result.filter(r => r.country === restrict)
      }
      setResults(result)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setResults([])
      setLoading(false)
    }
  }

  const suggestion = (p: Place) => [p.name, p.city, p.state, p.country].filter(Boolean).join(",")
  return (
    <div className='min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10 '>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full"
      >
        <div className="flex items-center gap-4 mb-6 px-1">
          <motion.div
            whileTap={{ scale: 0.88 }}
            onClick={() => router.back()}
            className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 cursor-pointer transition-colors shrink-0 "
          >
            <ArrowLeft size={20} />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black tracking-tight text-zinc-900">Book a Ride</h1>
            <p className="mt-0.5 text-zinc-400 text-xs">Find the perfect ride for your journey</p>
          </div>

          <div className="flex items-center gap-3 hrink-0">
            {
              [0, 1, 2, 3].map((d, i) => (
                <motion.div
                  key={i}
                  animate={{ width: progress > i ? 20 : 8, backgroundColor: progress > i ? "#000" : "#e5e7eb" }}
                  transition={{ duration: 0.4 }}
                  className="h-2 rounded-full"
                />


              ))
            }
          </div>

        </div>

        <div className='bg-white rounded-3xl border-zinc-200 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.2)]'>
          <div className='h-1 w-full bg-zinc-900' />
          <div className="p-6 space-y-7">
            <motion.div
              variants={varientStep}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.5 }}
            >
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0'>1</div>
                <p className='text-zinc-500 uppercase tracking-widset font-bold text-xs'>Choose Vehicle</p>
              </div>

              <div className='grid grid-cols-2 gap-3 cursor-pointer '>
                {VEHICLES.map((v, i) => {
                  const active = vehicle == v.id
                  return (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.07 + i * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVehicle(v.id as vehicleType)}
                      className={`relative p-3.5 rounded-2xl border flex items-center gap-3 text-left transition-all duration 
          ${active ? "bg-zinc-900 border-zinc-900 shadow-lg" : "bg-zinc-50 border-zinc-200 hover:border-zinc-400"}
          `}
                    >
                      <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors shrink-0
  ${active ? "bg-white" : "bg-zinc-300"}`}>
                        <v.Icon size={20} className={`${active ? "text-zinc-900" : "text-zinc-500"}`} />
                      </div>

                      <div className='min-w-0'>
                        <p className={`text-sm font-bold trancate ${active ? "text-white" : "text-zinc-900"}`} >{v.label}</p>
                        <p className={`text-[10px] truncate ${active ? "text-zinc-300" : "text-zinc-700"}`}>{v.desc}</p>
                      </div>

                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className='absolute top-2.5 right-2.5'>
                        {active && <CheckCircle size={15} className='text-white fill-white/20' />}
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            <div className='bg-zinc-200 h-px' />

            <motion.div
              variants={varientStep}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.5 }}
            >
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0'>2</div>
                <p className='text-zinc-500 uppercase tracking-widset font-bold text-xs'>Mobile</p>
              </div>

              <div className='flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus-within:border-zinc-900 focus-within:bg-white transition-all'>
                <div className='w-6 h-6 rounded-3xl  flex items-center justify-center shrink-0'>
                  <Phone size={20} className='text-zinc-800' />
                </div>

                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter your mobile number"
                  maxLength={15}
                  inputMode="numeric"
                  className={`flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none`}
                />

                <AnimatePresence>
                  {mobile.length == 10 && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    >
                      <CheckCircle size={15} className='text-emerald-500 fill-emerald-50 shrink-0' />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className='text-zinc-400 text-[10px] mt-2 ml-1'>Ride update will be sent to this number</p>

            </motion.div>

            <div className='bg-zinc-200 h-px' />

            <motion.div
              variants={varientStep}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.5 }}
            >
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0'>3</div>
                <p className='text-zinc-500 uppercase tracking-widset font-bold text-xs'>Route</p>
              </div>

              <div className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-visible'>

                {/* pickup location */}
                <div className='relative z-30'>
                  <div className='flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl transition-colors'>
                    <div><MapPin size={20} className='text-black fill-white' /></div>


                    <input
                      placeholder="Pickup location"
                      value={pickup}
                      onChange={(e) => {
                        setPickup(e.target.value)
                        sreachAddress(e.target.value, setPickUpSuggestions)
                      }}
                      className='flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none'
                    />

                    <motion.button
                      type="button"
                      disabled={locating}
                      onClick={currentLocation}
                      whileTap={{ scale: 0.88 }}
                      className={`w-8 h-8 rounded-xl bg-zinc-300 hover:bg-zinc-400 transition-colors flex items-center justify-center shrink-0 cursor-pointer ${locating ? "pointer-events-none opacity-70" : ""}`}
                    >
                      <LocateFixed size={15} className={`text-zinc-700 ${locating ? "animate-spin" : ""} `} />
                    </motion.button>

                  </div>

                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className='absolute right-0 top-full mt-1 left-0 w-full bg-white border border-zinc-200 rounded-b-2xl overflow-hidden shadow-lg max-h-27 overflow-y-auto z-50'
                    >
                      {pickupSuggestions.map((p, i) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          exit={{ opacity: 0 }}
                          className='flex items-center w-full gap-3 px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0 cursor-pointer'
                          onClick={() => {
                            setPickup(suggestion(p))
                            setPickupCountry(p.country || "")
                            setPickupLat(p.lat)
                            setPickupLon(p.lon)
                            setPickUpSuggestions([])
                          }}
                        >
                          <MapPin size={13} className='text-zinc-400 shrink-0' />
                          <span className='text-sm text-zinc-800 font-medium truncate'>{suggestion(p)}</span>
                          <ChevronRight size={13} className='text-zinc-300 shrink-0 m-auto' />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className='bg-zinc-200 h-px' />

                {/* drop location */}
                <div className='relative z-10'>
                  <div className='flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl transition-colors'>
                    <div><MapPin size={20} className='text-black fill-white' /></div>


                    <input
                      placeholder={!pickupCountry ? "Select Pickup Location First" : "Drop location"}
                      value={drop}
                      onChange={(e) => {
                        setDrop(e.target.value)
                        sreachAddress(e.target.value, setDropSuggestions, pickupCountry)
                      }}
                      disabled={!pickupCountry}
                      className={`flex-1 bg-transparent text-sm font-semibold outline-none ${!pickupCountry
                        ? "text-zinc-400 placeholder:text-zinc-300 cursor-not-allowed"
                        : "text-zinc-900 placeholder:text-zinc-400"
                        }`}
                    />
                    <Navigation size={15} className='shrink-0 text-zinc-400' />
                  </div>

                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className='absolute right-0 top-full mt-1 left-0 w-full bg-white border border-zinc-200 rounded-b-2xl overflow-hidden shadow-lg max-h-27 overflow-y-auto z-50'
                    >
                      {dropSuggestions.map((p, i) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          exit={{ opacity: 0 }}
                          className='flex items-center w-full gap-3 px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0 cursor-pointer '
                          onClick={() => {
                            setDropCountry(p.country || "")
                            setDrop(suggestion(p))
                            setDropLat(p.lat)
                            setDropLon(p.lon)
                            setDropSuggestions([])
                          }}
                        >
                          <Navigation size={13} className='text-zinc-400 shrink-0' />
                          <span className='text-sm text-zinc-800 font-medium truncate'>{suggestion(p)}</span>
                          <ChevronRight size={13} className='text-zinc-300 shrink-0 m-auto' />
                        </motion.div>
                      ))}
                    </motion.div>


                  </AnimatePresence>
                </div>
              </div>
              <motion.div
                variants={varientStep}
                initial={"hidden"}
                animate={"visible"}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={canCountinue ? { scale: 1.02 } : {}}
                  disabled={!canCountinue}
                  onClick={() => {
                    console.log({
                      pickupLat,
                      pickupLon,
                      dropLat,
                      dropLon
                    })
                    router.push(`/user/search?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&vehicle=${vehicle}&mobile=${encodeURIComponent(mobile)}&pickupLat=${pickupLat}&pickupLon=${pickupLon}&dropLat=${dropLat}&dropLon=${dropLon}`)
                  }}
                  className={`mt-7 w-full h-14 rounded-2xl bg-zinc-900 hover:bg-black disabled:opacity-35 text-white font-black text-sm 
tracking-wide flex items-center justify-center gap-3 transition-colors shadow-lg disabled:shadow-none cursor-pointer`} 
                >
                  <span>{loading ? <Loader size={15} className='animate-spin' /> : 'Continue'}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>



      </motion.div>
    </div>
  )
}

export default Page
