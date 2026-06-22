'use client'
import { IVehicle } from '@/models/VehicleModel'
import axios from 'axios'
import { Bike, Car, Truck, MapPin, Navigation, IndianRupee, ShieldCheck, Clock, CreditCard, ArrowRight, Banknote, Wallet, CheckCircle, Loader2, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { getSocket } from '@/lib/socket'


const VEHICLE_META: any = {
  bike: { label: "Bike", Icon: Bike },
  auto: { label: "Auto", Icon: Car },
  car: { label: "Car", Icon: Car },
  loading: { label: "Loading", Icon: Truck },
  truck: { label: "Truck", Icon: Truck },
}

type status = 'idle' | 'requested' | 'awaiting_payment' |
  'rejected' | 'expired' | 
  'payment' | 'confirmed'


const CheckoutComponents = () => {

  const router = useRouter()

  const params = useSearchParams()
  const [pickup, setPickup] = useState(params.get('pickup') || '')
  const [drop, setDrop] = useState(params.get('drop') || '')

  const vehicle = params.get('vehicle') || ""
  const vehicleId = params.get('vehicleId') || ""
  const driverId = params.get('driverId') || ""
  const mobile = params.get('mobile') || ""
  const fare = params.get('fare') || ''

  const pickupLat = Number(params.get('pickupLat'))
  const pickupLon = Number(params.get('pickupLon'))
  const dropLat = Number(params.get('dropLat'))
  const dropLon = Number(params.get('dropLon'))

  const [vehicles, setVehicles] = useState<IVehicle[]>([])
  const { Icon, label } = VEHICLE_META[vehicle] || { Icon: Car, label: 'Unknown' }
  const [state, setState] = useState<status>('idle')
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<any>()
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash')


  const handleBookingRequest = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/booking/create',
        {
          driverId,
          vehicleId,
          pickupLocation: {
            type: 'Point',
            coordinates: [pickupLon, pickupLat]
          },
          dropLocation: {
            type: 'Point',
            coordinates: [dropLon, dropLat]
          },
          pickupAddress: pickup,
          dropAddress: drop,
          fare: fare,
          userMobileNumber: mobile
        })
      setBooking(data)
      setLoading(false)
      setState('requested')
      console.log(data)
    } catch (error: any) {
      console.log(error.response.data.message)
    }
  }

  const fetchActiveRequest = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/booking/active')
      console.log(data)
      setBooking(data.booking)
      setState(data.booking.bookingStatus || data.booking)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    try {
      const { data } = await axios.get(`/api/booking/${booking._id}/cancel`)
      console.log(data)
      setState('idle')

    } catch (error) {
      console.log(error)
    }
  }

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false)
        return
      }

      if ((window as any).Razorpay) {
        resolve(true)
        return;
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }


  const handleConfirmPayment = async () => {
  if (!booking || !paymentMethod) return
setLoading(true)
  try {
    if (paymentMethod === 'online') {

      const razorpayLoaded = await loadRazorpay()

      if (!razorpayLoaded) {
        alert('Razorpay script failed to fetch')
        return
      }

      const { data } = await axios.post('/api/payment/create', {
        bookingId: booking._id
      })

      const paymentObject = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        currency: "INR",
        amount: data.amount,
        order_id: data.order,

        handler: async function (response: any) {
          const verify = await axios.post('/api/payment/verify', {
            bookingId: booking._id,
            ...response
          })
setLoading(false)
          if (verify.data.success) {
            router.push(`/user/ride/${booking._id}`)
          }
        }
      })

      paymentObject.open()

    } else {

      const { data } = await axios.get(
        `/api/booking/${booking._id}/confirm`
      )
setLoading(false)
      if (data.success) {
        router.push(`/user/ride/${booking._id}`)
      }

    }
  } catch (error: any) {
    console.log(error)
    setLoading(false)
  }
}


  useEffect(() => {
    if (state !== 'awaiting_payment') return
    const t = setTimeout(() => {
      setState('payment')
    }, 3000)
    return () => { clearTimeout(t) }
  }, [state])

  useEffect(() => { fetchActiveRequest() }, [])

   // socket
  useEffect(() => {
  const socket = getSocket()

  socket.on('accept-booking', (data) => {
    setState(data)
  })

  socket.on('reject-booking', (data) => {
    setState(data)
  })

  return () => {
    socket.off('accept-booking')
    socket.off('reject-booking')
  }
}, [])

  return (
    <div className='min-h-screen w-full bg-zinc-100 px-4 py-12'>
      <div className='relative max-w-6xl mx-auto z-10'>
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className='mb-10'
        >
          <div className='flex gap-2 items-center mb-2'>
            <div className='w-8 h-px bg-zinc-900' />
            <span className='text-[10px] font-black tracking-[0.2em] bg-zinc-200 uppercase'>Booking</span>
          </div>

          <h1 className='text-4xl font-black tracking-tright text-zinc-900'>Checkout</h1>
          <p className='text-zinc-400 font-medium text-xs mb-1.5'>Review your ride & confirm</p>
        </motion.div>



        <div className='grid lg:grid-cols-2 gap-6'>
          {/* left container */}
          {/* vehicle  */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.03, ease: [0.22, 1, 0.36, 1] }}
            className='bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
          >

            {/* Top Border */}
            <div className='h-1 bg-zinc-900' />

            {/* Card Content */}
            <div className='p-8 sm:p-10'>

              {/* Vehicle Header */}
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <div className='text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1'>
                    Selected Vehicle
                  </div>

                  <div className='text-3xl font-black tracking-tight text-zinc-900'>
                    {vehicle}
                  </div>
                </div>

                <div className='w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg'>
                  <Icon size={30} className='text-white' />
                </div>
              </div>

              {/* Pickup Card */}
              <div className='bg-zinc-50 border border-zinc-200 overflow-hidden mb-4 rounded-2xl'>
                <div className='gap-4 flex px-5 py-4 border-b border-zinc-100'>
                  <div className='flex flex-col items-center shrink-0 pt-0.5'>
                    <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white ring ring-zinc-300' />
                    <div className='w-px flex-1 bg-zinc-300 my-1' style={{ minHeight: 12 }} />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-0.5'>
                      Pickup
                    </div>

                    <div className='text-sm font-semibold text-zinc-900 leading-snug truncate'>
                      {pickup}
                    </div>
                  </div>

                  <MapPin className='text-zinc-400 shrink-0 mt-1' size={15} />
                </div>
              </div>

              {/* Drop Card */}
              <div className='bg-zinc-50 border border-zinc-200 overflow-hidden mb-4 rounded-2xl'>
                <div className='gap-4 flex px-5 py-4'>
                  <div className='flex flex-col items-center shrink-0 pt-0.5'>
                    <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white ring ring-zinc-300' />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-0.5'>
                      Drop
                    </div>

                    <div className='text-sm font-semibold text-zinc-900 leading-snug truncate'>
                      {drop}
                    </div>
                  </div>

                  <Navigation className='text-zinc-400 shrink-0 mt-1' size={15} />
                </div>
              </div>

              {/* Fare Section */}
              <div className='flex items-center justify-between pt-6 border-t border-zinc-100'>
                <div className='text-[10px] font-black tracking-[0.18em] uppercase text-zinc-400'>
                  Total Fare

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className='flex items-end gap-1'
                  >
                    <IndianRupee className='text-zinc-400' />

                    <span className='text-zinc-900 text-4xl font-black tracking-tight leading-none'>
                      {fare || 0}
                    </span>

                  </motion.div>
                </div>

                <p className='text-zinc-400 text-xs font-medium'>
                  Includes base & distance charges
                </p>
              </div>

            </div>


          </motion.div>

          {/* right container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.03, ease: [0.22, 1, 0.36, 1] }}
            className='bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
          >

            {/* Top Border */}
            <div className='h-1 bg-zinc-900' />

            <div className='flex-1 p-8 sm:p-10 flex flex-col'>
              <AnimatePresence mode='wait'>
                {/* idle */}
                {(state == 'idle' || state == 'rejected') && (
                  <motion.div
                    key={"idle"}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                    className='flex flex-col flex-1 justify-between'
                  >
                    <div>
                      <p className='text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400'>Ready to go?</p>
                      <h3 className='text-3xl font-black tracking-tight text-zinc-900 mb-6'>Confirm your Ride</h3>
                      <div className='bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3 mb-12'>
                        {
                          [
                            { icon: <Clock size={14} />, text: 'Driver will respond within 2 minutes' },
                            { icon: <ShieldCheck size={14} />, text: 'Verified & insured drivers only ' },
                            { icon: <CreditCard size={14} />, text: 'Pay after driver accepts' }
                          ].map((item, i) => (
                            <div key={i} className='flex items-center gap-3'>
                              <div className='w-7 h-7 rounded-2xl bg-zinc-200 text-zinc-600 flex items-center justify-center shrink-0' >{item.icon}</div>
                              <p className='text-zinc-500 text-xs font-medium '>{item.text}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 0.90 }}
                      whileTap={{ scale: 1.03 }}
                      onClick={handleBookingRequest}
                      className='w-full h-14 flex items-center justify-center bg-zinc-900 hover:bg-black disabled:opacity-40 
        text-white font-black text-sm rounded-2xl gap-2.5 transition-colors shadow-md cursor-pointer'
                    ><span>Request a Ride</span> <ArrowRight size={15} />
                    </motion.button>
                  </motion.div>
                )}

                {/* requested */}
                {state == 'requested' && (
                  <motion.div
                    key={'requested'}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1.02 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className='flex flex-col flex-1 items-center justify-center text-center gap-6 mt-15'
                  >
                    <div className='relative'>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0, 4] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                        className='absolute inset-0 rounded-full bg-zinc-900'
                      />
                      <div className="relative w-20 h-20 bg-zinc-50 border-2 border-zinc-200 rounded-full flex items-center justify-center ">
                        <Loader2 size={30} className='animate-spin text-zinc-900' />
                      </div>
                    </div>

                    <div>
                      <h3 className='text-xl font-black txt-zinc-900 mb-2'>Finding Your Driver</h3>
                      <p className='text-zinc-400 text-sm font-medium'>waiting for driver to accept... </p>
                    </div>

                    <motion.div
                      whileTap={{ scale: 1.02 }}
                      onClick={handleCancel}
                      className='flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors
                    border border-zinc-200 hover:border-zinc-500 rounded-xl px-4 py-2.5'
                    ><XCircle size={15} /> Cancel Request
                    </motion.div>
                  </motion.div>
                )}


                {/* awaiting_payment */}
                {state == 'awaiting_payment' && (
                  <motion.div
                    key={'awaiting_payment'}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1.02 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.40 }}
                    className='flex flex-col flex-1 text-center items-center justify-center gap-5 mt-15'
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 270, damping: 18 }}
                      className='w-20 h-20 rounded-full bg-zinc-100 border border-zinc-300 flex items-center justify-center'
                    >
                      <CheckCircle size={38} className='text-zinc-900' />
                    </motion.div>

                    <div>
                      <h3 className='text-xl font-black text-zinc-900 mb-1'>Driver Accepted</h3>
                      <p className='text-zinc-400 text-sm font-medium'>Preparing payment options...</p>
                    </div>

                    <div className='w-48 h-1.5 overflow-hidden rounded-full bg-zinc-100'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                        className='rounded-full h-full bg-zinc-900'
                      />
                    </div>
                  </motion.div>
                )}


                {/* payment */}
                {state == 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className='flex flex-col gap-6 flex-1'
                  >
                    <div>
                      <h3 className='text-[10px] font-black tracking-[0.18em] text-zinc-400 mb-1 uppercase '>Almost There</h3>
                      <p className='text-2xl font-black text-zinc-900 '>Select Payment Method</p>
                    </div>

                    <div className='space-y-3'>
                      {[
                        { id: 'cash', Icon: Banknote, title: 'Cash', sub: 'Pay driver after ride.' },
                        { id: 'online', Icon: Wallet, title: 'Online Payment', sub: 'UPI . Card . Netbanking' }
                      ].map((p, i) => {
                        const active = paymentMethod == p.id
                        return (
                          <motion.div
                            key={p.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPaymentMethod(p.id as any)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200
                            ${active ? 'bg-zinc-900 border-zinc-900' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-white/10' : 'bg-zinc-200'}`}>
                              <p.Icon size={18} className={`${active ? 'text-white' : 'text-zinc-600'}`} />
                            </div>

                            <div className='min-w-0 flex-1'>
                              <p className={`text-sm font-bold ${active ? 'text-white' : 'text-zinc-900'}`}>{p.title}</p>
                              <p className={`text-xs font-medium ${active ? 'text-zinc-300' : 'text-zinc-500'}`}>{p.sub}</p>
                            </div>

                            <AnimatePresence>
                              {active && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <CheckCircle size={15} className='shrink-0 text-white' />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                      })}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleConfirmPayment}
                      whileHover={paymentMethod ? { scale: 1.03 } : {}}
                      disabled={!paymentMethod}
                      className={`w-full h-15 bg-zinc-900 hover:bg-black disabled:opacity-30 text-white font-black text-sm rounded-2xl 
                        flex items-center justify-center gap-3 transition-colors shadow-md mt-auto cursor-pointer`}
                    >
                      {loading 
                      ? <Loader2 size={18} className='animate-spin' />
                      :
                      paymentMethod == 'cash' ? <><Banknote /><span>Confirm cash ride</span></> : <><span>Proceed to payment </span><ArrowRight size={15} /></>}
                    </motion.button>
                  </motion.div>
                )}

                {state == 'confirmed' && (
                  <motion.div
                  key="confirmed"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className='flex flex-col gap-6 flex-1 items-center justify-center'
                  >
<motion.div
initial={{scale:0, rotate:-20}}
animate={{scale:1, rotate:0}}
transition={{type:'spring', stiffness:250, damping:15, delay:0.5}}
className='relative mt-15'
>
  <div className='flex items-center justify-center w-20 h-20 rounded-full bg-zinc-50 border-2 border-zinc-200'>
    <CheckCircle size={45} className='text-zinc-900' />
    </div>
{[0,1].map((i)=>(
  <motion.div
  initial={{scale:1, opacity:0.5}}
  animate={{scale: 2.2 + i * 0.6, opacity:0}}
  transition={{duration:0.8, delay:0.2 + i * 0.16}}
  className='absolute inset-0 border-2 rounded-full border-zinc-900'
  />
))}
</motion.div>
<div>
  <motion.h3
  initial={{opacity:0, y:9}}
  animate={{opacity:1, y:0}}
  transition={{delay:0.5}}
  className='text-4xl font-black text-zinc-900 mb-2'
  >
    Ride Confirmed!
  </motion.h3>
  <motion.p
  initial={{opacity:0}}
  animate={{opacity:1}}
  transition={{delay:0.5}}
  className='max-w-xs text-zinc-400 font-medium text-sm'
  >
    Your driver is on the way. Track live form the ride screen
  </motion.p>
</div>

<motion.button
initial={{opacity:0, y:9}}
animate={{opacity:1, y:0}}
transition={{delay:0.4}}
whileTap={{scale:0.98}}
whileHover={{scale:1.04}}
onClick={()=>{ window.location.href = `/ride/${booking._id}`}}
className='flex items-center gap-3 bg-zinc-900 hover:bg-black text-white font-black text-sm px-8 py-6 rounded-2xl shadow-md transition-colors cursor-pointer'
>
  Track Your Ride <ArrowRight size={16} />
</motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutComponents
