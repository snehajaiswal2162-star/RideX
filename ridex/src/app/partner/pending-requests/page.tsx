'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { Clock, Loader2, MapPin, Navigation, IndianRupee } from 'lucide-react'
import { BookingStatus, PaymentStatus } from '@/models/bookingModel'
import { useRouter } from 'next/navigation'
import { getSocket } from '@/lib/socket'


interface IBooking {
  _id: string
  user: string
  driver?: string
  vehicle: string

  pickupAddress: string;
  dropAddress: string;

  pickupLocation: {
    type: "Point";
    coordinates: [number, number];
  };

  dropLocation: {
    type: "Point";
    coordinates: [number, number];
  };

  fare: number;

  userMobileNumber: number;
  driverMobileNumber?: number;

  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentDeadline: Date;

  adminCommission: number;
  partnerAmount: number;

  pickupOtp?: string;
  pickupOtpExpires?: Date;

  dropOtp?: string;
  dropOtpExpires?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

const page = () => {

  const [bookings, setBookings] = useState<IBooking[]>([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const fetchPendingRequests = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/partner/bookings/pending')
      console.log(data)
      setBookings(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const fetchAccept = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/partner/bookings/${id}/accept`)
      console.log(data)
      router.push(`/partner/bookings`)
    } catch (error: any) {
      console.log(error.response.data.message)
    }
  }

  const fetchReject = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/partner/bookings/${id}/reject`)
      console.log(data)
      window.location.reload()
    } catch (error: any) {
      console.log(error.response.data.message)
    }
  }

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  // socket
  useEffect(() => {
  const socket = getSocket()

  socket.on('new-booking', (data) => {
    setBookings((prev) => [...prev, data])
  })

  return () => {
    socket.off('new-booking')
  }
}, [])

  return (
    <div className='min-h-screen bg-[#f4f5f7]'>
      <div className='bg-white border-b border-zinc-200'>
        <div className='max-w-6xl mx-auto py-16 px-6'>
          <h1 className='text-zinc-900 text-4xl font-semibold'>Ride Requests</h1>
          <p className='mt-3 text-lg text-zinc-500'>Manage incoming ride request & respond in real time.</p>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-12'>
        {loading ? (
          <div className='flex justify-center py-20'>
            <Loader2 className='aminate-spin w-9 h-9 text-zinc-700' />
          </div>
        ) : bookings.length == 0 ? (
          <div className='bg-white rounded-2xl border border-zinc-200 p-16 shadow-md text-center'>
            <div className='text-zinc-500 text-lg'>No pending ride requests</div>
          </div>
        ) : (
          <div className='space-y-6'>
            {bookings.map((b, i) => (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
                className='bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 hover:shadow-md transition'
              >
                <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8'>
                  {/* left */}
                  <div className="flex-1 space-y-6">
                    {/* pickup */}
                    <div className="flex gap-4">
                      <div className="bg-zinc-100 p-3 rounded-lg flex  items-center justify-center">
                        <MapPin size={20} />
                      </div>

                      <div className='flex flex-col'>
                        <div className="text-xs uppercase text-zinc-400 mb-1">Pickup Location</div>
                        <div className='text-gray-900 font-medium'>{b.pickupAddress}</div>
                      </div>
                    </div>
                    {/* drop */}
                    <div className="flex gap-4">
                      <div className="bg-zinc-100 p-3 rounded-lg flex items-center justify-center">
                        <Navigation size={20} />
                      </div>

                      <div className='flex flex-col'>
                        <div className="text-xs uppercase text-zinc-400 mb-1">Drop Location</div>
                        <div className='text-gray-900 font-medium'>{b.dropAddress}</div>
                      </div>
                    </div>

                    {/* clock time */}
                    <div className='flex items-center gap-2 text-sm text-zinc-400 mt-2'>
                      <Clock size={15} className='opacity-70' />
                      <span className='font-medium'>
                        {new Date(b.createdAt!).toLocaleString('en-IN', {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>

                  {/* right */}
                  <div className='flex flex-col justify-between lg:items-end gap-6 w-full lg:w-auto'>
                    <div className='text-left lg:text-right'>
                      <p className='text-xs tracking-wide text-zinc-400 uppercase mb-1'>Estimated Fare</p>
                      <div className='flex items-center gap-2 text-3xl font-bold text-zinc-900 lg:justify-end'>
                        <IndianRupee size={20} />
                        {b.fare}</div>
                    </div>

                    {/* button */}
                    <div className='flex gap-4 w-full lg:w-auto'>
                      <button className='flex-1 lg:flex-none px-6 py-3 rounded-xl border border-zinc-300 bg-white text-zinc-700
                    text-sm font-semibold hover:bg-zinc-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer'
                        onClick={() => fetchReject(b._id)}
                      >
                        Reject
                      </button>

                      <button className='flex-1 lg:flex-none px-8 py-4 rounded-xl  bg-zinc-900 text-white flex items-center justify-center
                    text-sm font-semibold hover:bg-zinc-900 transition-all hover:shadow-lg duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer'
                        onClick={() => fetchAccept(b._id)}
                      >
                        Accept Ride
                      </button>
                    </div>
                  </div>


                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default page
