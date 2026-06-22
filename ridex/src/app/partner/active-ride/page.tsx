'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import axios from 'axios'
import { BookingStatus, IBooking, PaymentStatus } from '@/models/bookingModel'
import { Zap, ChevronUp, MapPin, ArrowRight, KeyRound, Navigation } from 'lucide-react'
import PanelContext from '@/components/PanelContext'
import dynamic from 'next/dynamic';
import { getSocket } from '@/lib/socket'
import CompleteScreen from '@/components/CompleteScreen'

const LiveRideMap = dynamic(() => import('@/components/LiveRideMap'), { ssr: false });



const MAP_STATUS: Record<BookingStatus, 'arriving' | 'ongoing' | 'completed'> = {
  idle: 'arriving',
  requested: 'arriving',
  awaiting_payment: 'arriving',
  confirmed: 'arriving',
  started: 'ongoing',
  completed: 'completed',
  cancelled: 'completed',
  rejected: 'completed',
  expired: 'completed',
}

const STATUS_LABEL: Record<BookingStatus, { label: string; sublabel: string; dot: string }> = {
  idle: { label: "Awaiting Confirmation", sublabel: "Booking is being processed", dot: "bg-amber-400" },
  requested: { label: "Awaiting Confirmation", sublabel: "Booking is being processed", dot: "bg-amber-400" },
  awaiting_payment: { label: "Payment Pending", sublabel: "Customer payment is pending", dot: "bg-purple-400" },
  confirmed: { label: "Heading to Pickup", sublabel: "Drive to the pickup location", dot: "bg-amber-400" },
  started: { label: "Ride in Progress", sublabel: "Heading to drop location", dot: "bg-emerald-400" },
  completed: { label: "Ride Completed", sublabel: "Trip has ended successfully", dot: "bg-zinc-400" },
  cancelled: { label: "Ride Cancelled", sublabel: "This ride was cancelled", dot: "bg-red-400" },
  rejected: { label: "Ride Rejected", sublabel: "Ride was rejected", dot: "bg-red-400" },
  expired: { label: "Request Expired", sublabel: "Booking timed out", dot: "bg-orange-400" },
};

const PAYMENT_BADGE: Record<PaymentStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
  paid: { label: "Paid", cls: "bg-emerald-100 text-emerald-700" },
  cash: { label: "Cash", cls: "bg-zinc-100 text-zinc-700" },
  failed: { label: "Failed", cls: "bg-red-100 text-red-700" },
};

const Page = () => {
  const [bookings, setBookings] = useState<IBooking | null>(null)
  const [loading, setLoading] = useState(true) // Initialized to true to catch first fetch loop cleanly
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null)
  const [pickupPos, setpickupPos] = useState<[number, number] | null>(null)
  const [dropPos, setDropPos] = useState<[number, number] | null>(null)
  const [distanceToPickup, setDistanceToPickup] = useState(0)
  const [distanceToDrop, setDistanceToDrop] = useState(0)
  const [etaToPickup, setEtaToPickup] = useState(0)
  const [etaToDrop, setEtaToDrop] = useState(0)
  const [status, setStatus] = useState("")
  const [chatOpen, setChatOpen] = useState(false)
  const [expended, setExpended] = useState(false)


  // pickup otp
  const [otpMode, setOtpMode] = useState(false)
  const [otp, setOtp] = useState('')
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState('')

  // drop otp
  const [dropOtpMode, setDropOtpMode] = useState(false)
  const [dropOtp, setDropOtp] = useState('')
  const [loadingDropOtp, setLoadingDropOtp] = useState(false)
  const [dropOtpError, setDropOtpError] = useState('')

  const handleSendPickupOtp = async () => {
    try {
      const { data } = await axios.post('/api/partner/bookings/otp/pickup/send', { bookingId: bookings?._id })
      console.log(data)
      setOtpMode(true)
    } catch (error: any) {
      console.log(error.response.data.message)
    }
  }

  const handleSendDropOtp = async () => {
    try {
      const { data } = await axios.post('/api/partner/bookings/otp/drop/send', { bookingId: bookings?._id })
      console.log(data)
      setDropOtpMode(true)
    } catch (error: any) {
      console.log(error.response.data.message)
    }
  }

  const handleVerifyPickupOtp = async () => {
    setLoadingOtp(true)
    try {
      const { data } = await axios.post('/api/partner/bookings/otp/pickup/verify', { bookingId: bookings?._id, otp })
      console.log(data)
      setOtpVerified(true)
      setOtpMode(false)
      setLoadingOtp(false)
      setBookings(prev => prev ? { ...prev, bookingStatus: 'started' } : prev)
      setStatus('started')
    } catch (error: any) {
      console.log(error.response.data.message)
      setOtpError(error.response.data.response ?? "Verification failed")
      setLoadingOtp(false)
    }
  }

  const handleVerifyDropOtp = async () => {
    setLoadingDropOtp(true)
    try {
      const { data } = await axios.post('/api/partner/bookings/otp/drop/verify', { bookingId: bookings?._id, otp: dropOtp })
      console.log(data)
      setLoadingDropOtp(false)
      setDropOtpMode(true)
      setBookings(prev => prev ? { ...prev, bookingStatus: 'started' } : prev)
      setStatus('completed')
    } catch (error: any) {
      console.log(error.response.data.message)
      setLoadingDropOtp(false)
      setDropOtpError(error.response.data.message ?? "Verification failed")
    }
  }

  const onChatToggle = () => {
    setChatOpen(prev => !prev)
  }

  useEffect(() => {
    const fetchActiveRide = async () => {
      try {
        const { data } = await axios.get('/api/partner/active-ride')

        if (!data || data.length === 0) {
          setLoading(false)
          return
        }
        const booking = data[0]
        setBookings(booking)
        setStatus(booking.bookingStatus)

        setpickupPos([
          booking.pickupLocation.coordinates[1],
          booking.pickupLocation.coordinates[0]
        ])

        setDropPos([
          booking.dropLocation.coordinates[1],
          booking.dropLocation.coordinates[0]
        ])
      } catch (error: any) {
        console.log("Failed to fetch active ride:", error.response?.data?.message)
      } finally {
        setLoading(false)
      }
    }
    fetchActiveRide()
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    const socket = getSocket()

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setDriverPos([lat, lon])
        socket.emit('driver-location-update', {
          bookingId: bookings?._id, 
          latitude: lat, 
          longitude: lon, 
          status: status
        })
      },
        (err) => {
    console.error('Geolocation Error:', err)
  },
      { enableHighAccuracy: true, 
        maximumAge: 2000, 
        timeout: 10000 
      }
    )
    return () => { navigator.geolocation.clearWatch(watchId) }
  }, [bookings?._id])

  useEffect(() => {
    if (!bookings?._id) return
    const socket = getSocket()
    socket.emit('join ride', bookings?._id)
    socket.on('driver location', ({ latitude, longitude }) => {
      setDriverPos([latitude, longitude])
    })
    return () => {
      socket.off('join ride')
      socket.off('driver location')
    }
  }, [bookings?._id])

  if (loading) {
    return (
      <div className='h-screen w-full bg-zinc-900 flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin' />
          <p className='text-white/40 text-sm tracking-widest uppercase font-medium'>Loading Ride...</p>
        </div>
      </div>
    )
  }

  if (status === 'completed' && bookings) {
    return (
      <CompleteScreen booking={bookings} role='Driver' />
    )
  }

  const activeStatus: BookingStatus = bookings?.bookingStatus || 'confirmed'
  const cfg = STATUS_LABEL[activeStatus]
  const canChat = bookings?.bookingStatus === 'confirmed'
  const isActive = ['confirmed', 'started'].includes(status)
  const displayEta = status === 'confirmed' ? etaToPickup : etaToDrop
  const displayDistance = status === 'confirmed' ? distanceToPickup : distanceToDrop
  const paymentStatus = PAYMENT_BADGE[bookings?.paymentStatus! ?? "pending"]

  const PanelProps = {
    displayDistance, displayEta, isActive, cfg, status, bookings,
    paymentStatus, canChat, chatOpen, onChatToggle, currentRole: 'Driver'
  }

  return (
    <div className='h-screen w-full bg-zinc-50 flex flex-col lg:flex-row overflow-hidden'>
      <div className='flex-1 relative h-full z-0'>

        {/* Conditional rendering block ensures we pass actual tracking positions down instantly */}
        {driverPos && pickupPos && dropPos ? (
          <LiveRideMap
            driverLocation={driverPos}
            pickupLocation={pickupPos}
            dropLocation={dropPos}
            mapStatus={MAP_STATUS[activeStatus] ?? 'arriving'}
            onStats={({ distanceToPickup, etaToPickup, distanceToDrop, etaToDrop }) => {
              setDistanceToPickup(distanceToPickup)
              setEtaToPickup(etaToPickup)
              setDistanceToDrop(distanceToDrop)
              setEtaToDrop(etaToDrop)
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white/50 text-sm tracking-wider gap-3">
            <div className='w-6 h-6 rounded-full border-2 border-white/10 border-t-white/70 animate-spin' />
            <span>ACQUIRING GPS SIGNAL...</span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='absolute top-4 left-1/2 -translate-x-1/2 z-[500] pointer-events-none'
        >
          <div className='flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg rounded-full border border-zinc-100'>
            <span className={`w-2 h-2 rounded-full animate-pulse ${cfg.dot}`} />
            <span className='text-xs font-semibold tracking-wide text-zinc-900'>{cfg.label}</span>
          </div>
        </motion.div>
      </div>
      {/* desktop */}

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        className='hidden lg:flex w-[420px] xl:w-[460px] bg-white border-1 border-zinc-100 flex-col overflow-hidden '
      >
        <div className='bg-zinc-950 px-6  py-5 shrink-0'>
          <p className='text-zinc-500 text-[10px] tracking-[0.18em] uppercase font-semibold mb-1'>driver panel</p>

          <div className='flex items-center justify-between'>
            <h1 className='text-white text-lg font-bold'>Active Ride</h1>
            {isActive && (
              <div className='flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full'>
                <Zap size={12} className='text-amber-300' />
                <span className='text-white text-xs font-semibold'>{Math.round(displayEta)} min</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex overflow-y-auto scollbar-hidden">
            <PanelContext {...PanelProps} />
          </div>

{/* destop oickup and drop otp */}
<div className='px-9 pb-6 pt-2 '>
  <AnimatePresence mode='wait'>
              {status === 'confirmed' && !otpMode && !otpVerified && (
                <motion.button
                  key='arrived'
                  onClick={() => handleSendPickupOtp()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className='w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.97] text-white py-4 rounded-2xl font-bold text-sm 
      tracking-wide transition-all gap-2 flex items-center justify-center'
                >
                  <MapPin size={17} /> I've Arrived at Pickup <ArrowRight size={15} className='ml-1' />
                </motion.button>
              )}


              {status === 'confirmed' && otpMode && !otpVerified && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1.02 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'
                >
                  <div className='bg-zinc-900 px-4 py-3 flex items-center gap-2'>
                    <KeyRound size={15} className='text-amber-400' />
                    <p className='text-white text-xs font-bold tracking-wide uppercase'>
                      Enter Customer OTP
                    </p>
                  </div>
                  <div className='py-4 space-y-3'>
                    <p className='text-zinc-400'>Ask the customer for their 4-digit otp to start the ride</p>
                    <div className='flex justify-center'>
                      <input
                        type='text'
                        onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError('') }}
                        placeholder='. . . .'
                        className='w-48 border-2 border-zinc-200 focus:border-zinc-900 rounded-lg px-4 py-3 txt-center text-2xl 
            tracking-[0.5em] font-black outline-none transition-colors'
                      />
                    </div>
                    {otpError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-xs text-red-500 text-center font-medium'
                      >
                        {otpError}
                      </motion.div>
                    )}

                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={() => {
                          setOtpMode(false)
                          setOtp("")
                          setOtpError("")
                        }}
                        className="flex-1 h-12 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-sm font-semibold
    hover:bg-zinc-50 transition-all active:scale-95 cursor-pointer">
                        Cancel
                      </button>


                      <button
                        onClick={handleVerifyPickupOtp}
                        disabled={loadingOtp || otp.length < 4}
                        className="flex-1 h-12 rounded-xl bg-zinc-950 text-white text-sm font-bold shadow-lg shadow-zinc-900/20 hover:bg-black
    disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center cursor-pointer">

                        {
                          loadingOtp
                            ?
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin cursor-pointer " />
                              Verifying...
                            </span>
                            :
                            "Verify OTP"
                        }

                      </button>

                    </div>
                  </div>
                </motion.div>
              )}

              {status === 'started' && !dropOtpMode && (
                <motion.button
                  key='drop'
                  onClick={() => handleSendDropOtp()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className='w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.97] text-white py-4 rounded-2xl font-bold text-sm 
      tracking-wide transition-all gap-2 flex items-center justify-center cursor-pointer'
                >
                  <Navigation size={17} /> Mark as dropped <ArrowRight size={15} className='ml-1' />
                </motion.button>
              )}


              {status === 'started' && dropOtpMode && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1.02 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'
                >
                  <div className='bg-zinc-900 px-4 py-3 flex items-center gap-2'>
                    <KeyRound size={15} className='text-amber-400' />
                    <p className='text-white text-xs font-bold tracking-wide uppercase'>
                      Enter Customer OTP
                    </p>
                  </div>
                  <div className='py-4 space-y-3'>
                    <p className='text-zinc-400'>Ask the customer for their 4-digit otp to complete the ride</p>
                    <div className='flex justify-center'>
                      <input
                        type='text'
                        onChange={e => { setDropOtp(e.target.value.replace(/\D/g, '')); setDropOtpError('') }}
                        placeholder='. . . .'
                        className='w-48 border-2 border-zinc-200 focus:border-zinc-900 rounded-lg px-4 py-3 txt-center text-2xl 
            tracking-[0.5em] font-black outline-none transition-colors'
                      />
                    </div>
                    {dropOtpError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-xs text-red-500 text-center font-medium'
                      >
                        {dropOtpError}
                      </motion.div>
                    )}

                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={() => {
                          setDropOtpMode(false)
                          setDropOtp("")
                          setDropOtpError("")
                        }}
                        className="cursor-pointer
    flex-1
    h-12
    rounded-xl
    border
    border-zinc-200
    bg-white
    text-zinc-700
    text-sm
    font-semibold
    hover:bg-zinc-50
    transition-all
    active:scale-95
    "
                      >
                        Cancel
                      </button>


                      <button
                        onClick={handleVerifyDropOtp}
                        disabled={loadingDropOtp || dropOtp.length < 4}
                        className=" cursor-pointer
    flex-1
    h-12
    rounded-xl
    bg-zinc-950
    text-white
    text-sm
    font-bold
    shadow-lg
    shadow-zinc-900/20
    hover:bg-black
    disabled:opacity-40
    transition-all
    active:scale-95
    flex
    items-center
    justify-center
    "
                      >

                        {
                          loadingDropOtp
                            ?
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Verifying...
                            </span>
                            :
                            "Verify OTP"
                        }

                      </button>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* mobile */}
      <div className='lg:hidden bottom-0 right-0 left-0 z-20 fixed pointer-events-none'>
        <motion.div
          className='bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto'
          animate={{ height: expended ? '82vh' : 142 }}
          transition={{ type: 'spring', stiffness: 320, damping: 40 }}
        >
          <div className='cursor-pointer shrink-0 select-none'
            onClick={() => setExpended(p => !p)}
          >
            <div className='pt-3 pb-1'>
              <div className='w-10 h-1 rounded-full mx-auto bg-zinc-300 ' />
            </div>

            <div className='px-5 py-3 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0  ${cfg.dot}`} />
                <div>
                  <p className='text-sm font-bold leading-tight text-inc-900'>{cfg.label}</p>
                  <p className='text-sm leading-tight text-zinc-400'>{cfg.sublabel}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                {isActive && (
                  <div className='text-right'>
                    <p className='text-2xl font-black leading-none text-zinc-900'>{Math.round(displayEta)}</p>
                    <p className='text-[10px] text-zinc-400 tracking-wider uppercase'>min</p>
                  </div>
                )}
                <motion.div
                  animate={{ rotate: expended ? 180 : 0 }}
                  transition={{ duration: 0.30 }}
                  className='w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center'
                >
                  <ChevronUp size={15} className='text-zinc-600' />
                </motion.div>
              </div>
            </div>
            <div className='h-px bg-zinc-100 mx-5' />
          </div>

          <div className='flex-1 overflow-y-auto min-h-0'>
            <PanelContext {...PanelProps} />
          </div>

          <div className='shrink-0  bg-white px-5 py-6 border-t border-zinc-200'>
            <AnimatePresence mode='wait'>
              {status === 'confirmed' && !otpMode && !otpVerified && (
                <motion.button
                  key='arrived'
                  onClick={() => handleSendPickupOtp()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className='w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.97] text-white py-4 rounded-2xl font-bold text-sm 
      tracking-wide transition-all gap-2 flex items-center justify-center cursor-pointer'
                >
                  <MapPin size={17} /> I've Arrived at Pickup <ArrowRight size={15} className='ml-1' />
                </motion.button>
              )}


              {status === 'confirmed' && otpMode && !otpVerified && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1.02 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'
                >
                  <div className='bg-zinc-900 px-4 py-3 flex items-center gap-2'>
                    <KeyRound size={15} className='text-amber-400' />
                    <p className='text-white text-xs font-bold tracking-wide uppercase'>
                      Enter Customer OTP
                    </p>
                  </div>
                  <div className='py-4 space-y-3'>
                    <p className='text-zinc-400'>Ask the customer for their 4-digit otp to start the ride</p>
                    <div className='flex justify-center'>
                      <input
                        type='text'
                        onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError('') }}
                        placeholder='. . . .'
                        className='w-48 border-2 border-zinc-200 focus:border-zinc-900 rounded-lg px-4 py-3 txt-center text-2xl 
            tracking-[0.5em] font-black outline-none transition-colors'
                      />
                    </div>
                    {otpError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-xs text-red-500 text-center font-medium'
                      >
                        {otpError}
                      </motion.div>
                    )}

                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={() => {
                          setOtpMode(false)
                          setOtp("")
                          setOtpError("")
                        }}
                        className="flex-1 h-12 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-sm font-semibold
    hover:bg-zinc-50 transition-all active:scale-95 cursor-pointer">
                        Cancel
                      </button>


                      <button
                        onClick={handleVerifyPickupOtp}
                        disabled={loadingOtp || otp.length < 4}
                        className="flex-1 h-12 rounded-xl bg-zinc-950 text-white text-sm font-bold shadow-lg shadow-zinc-900/20 hover:bg-black
    disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center cursor-pointer">

                        {
                          loadingOtp
                            ?
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin " />
                              Verifying...
                            </span>
                            :
                            "Verify OTP"
                        }

                      </button>

                    </div>
                  </div>
                </motion.div>
              )}

              {status === 'started' && !dropOtpMode && (
                <motion.button
                  key='drop'
                  onClick={() => handleSendDropOtp()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className='w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.97] text-white py-4 rounded-2xl font-bold text-sm 
      tracking-wide transition-all gap-2 flex items-center justify-center cursor-pointer'
                >
                  <Navigation size={17} /> Mark as dropped <ArrowRight size={15} className='ml-1' />
                </motion.button>
              )}


              {status === 'started' && dropOtpMode && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1.02 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'
                >
                  <div className='bg-zinc-900 px-4 py-3 flex items-center gap-2'>
                    <KeyRound size={15} className='text-amber-400' />
                    <p className='text-white text-xs font-bold tracking-wide uppercase'>
                      Enter Customer OTP
                    </p>
                  </div>
                  <div className='py-4 space-y-3'>
                    <p className='text-zinc-400'>Ask the customer for their 4-digit otp to complete the ride</p>
                    <div className='flex justify-center'>
                      <input
                        type='text'
                        onChange={e => { setDropOtp(e.target.value.replace(/\D/g, '')); setDropOtpError('') }}
                        placeholder='. . . .'
                        className='w-48 border-2 border-zinc-200 focus:border-zinc-900 rounded-lg px-4 py-3 txt-center text-2xl 
            tracking-[0.5em] font-black outline-none transition-colors'
                      />
                    </div>
                    {dropOtpError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-xs text-red-500 text-center font-medium'
                      >
                        {dropOtpError}
                      </motion.div>
                    )}

                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={() => {
                          setDropOtpMode(false)
                          setDropOtp("")
                          setDropOtpError("")
                        }}
                        className="cursor-pointer
    flex-1
    h-12
    rounded-xl
    border
    border-zinc-200
    bg-white
    text-zinc-700
    text-sm
    font-semibold
    hover:bg-zinc-50
    transition-all
    active:scale-95
    "
                      >
                        Cancel
                      </button>


                      <button
                        onClick={handleVerifyDropOtp}
                        disabled={loadingDropOtp || dropOtp.length < 4}
                        className="cursor-pointer
    flex-1
    h-12
    rounded-xl
    bg-zinc-950
    text-white
    text-sm
    font-bold
    shadow-lg
    shadow-zinc-900/20
    hover:bg-black
    disabled:opacity-40
    transition-all
    active:scale-95
    flex
    items-center
    justify-center
    "
                      >

                        {
                          loadingDropOtp
                            ?
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Verifying...
                            </span>
                            :
                            "Verify OTP"
                        }

                      </button>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </div >
  )
}

export default Page