'use client'
import { BookingStatus, PaymentStatus } from '@/models/bookingModel'
import { IUser } from '@/models/UserModel'
import { IVehicle } from '@/models/VehicleModel'
import axios from 'axios'
import { Bike, Car, Loader2, Phone, Truck, User, MapPin, Navigation, Calendar, IndianRupee, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'


interface IBooking {
    user: IUser
    driver?: IUser
    vehicle: IVehicle

    pickupAddress: string
    dropAddress: string

    pickupLocation: {
        type: "Point"
        coordinates: [number, number]
    }

    dropLocation: {
        type: "Point"
        coordinates: [number, number]
    }

    fare: number

    userMobileNumber: number
    driverMobileNumber?: number

    bookingStatus: BookingStatus
    paymentStatus: PaymentStatus
    paymentDeadline: Date

    adminCommission: number
    partnerAmount: number

    pickupOtp?: string
    pickupOtpExpires?: Date

    dropOtp?: string
    dropOtpExpires?: Date

    createdAt?: Date
    updatedAt?: Date
}

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
        completed: "bg-teal-50 text-teal-700 border-teal-200",
        requested: "bg-amber-50 text-amber-700 border-amber-200",
        awaiting_payment: "bg-blue-50 text-blue-700 border-blue-200",
        cancelled: "bg-rose-50 text-rose-700 border-rose-200",
        rejected: "bg-red-50 text-red-700 border-red-200",
        expired: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType?.toLowerCase()) {
        case 'bike':
            return <Bike className='w-4 h-4 text-zinc-500' />
        case 'auto':
            return <Car className='w-4 h-4 text-zinc-500' />
        case 'truck':
            return <Truck className='w-4 h-4 text-zinc-500' />
        case 'car':
        case 'loading':
        default:
            return <Car className='w-4 h-4 text-zinc-500' />
    }
}


const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US',{
        day:'numeric',
        month:'short',
        hour:'2-digit',
        minute:'2-digit',
    }).replace(',','')
}

const Page = () => {
    const [bookings, setBookings] = useState<IBooking[]>([])
    const [selectStatus, setSelectStatus] = useState('All')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get('/api/partner/bookings')
                console.log(data)
                setBookings(data)
            } catch (error: any) {
                console.log(error?.response?.data?.message)
            } finally {
                setLoading(false)
            }
        }

        fetch()
    }, [])

    const filterBookings =
        selectStatus === 'All'
            ? bookings
            : bookings.filter(
                b => b.bookingStatus === selectStatus.toLowerCase()
            )

    return (
        <div className='min-h-screen bg-zinc-50'>
            {/* Header */}
            <div className='bg-white border-b border-zinc-200'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-3xl mx-auto py-6'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-blue-100 p-2 rounded-lg'>
                                <Car className='w-5 h-5 text-blue-600' />
                            </div>

                            <div>
                                <h1 className='text-2xl font-semibold text-zinc-900'>
                                    Partner Bookings
                                </h1>

                                <p className='text-zinc-500 mt-1 text-sm'>
                                    {bookings.length}{' '}
                                    {bookings.length === 1 ? 'ride' : 'rides'} assigned to you
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div className='max-w-3xl mx-auto'>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='text-sm text-zinc-500'>
                            Showing {filterBookings.length} bookings
                        </div>

                        <select
                            value={selectStatus}
                            onChange={(e) => setSelectStatus(e.target.value)}
                            className='bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-200'
                        >
                            <option>All</option>
                            <option>requested</option>
                            <option>awaiting_payment</option>
                            <option>confirmed</option>
                            <option>started</option>
                            <option>completed</option>
                            <option>cancelled</option>
                            <option>rejected</option>
                            <option>expired</option>
                        </select>
                    </div>

                    {loading && (
                        <div className='flex justify-center py-16'>
                            <Loader2 className='text-black w-9 h-9 animate-spin' />
                        </div>
                    )}

                    {!loading && filterBookings.length === 0 && (
                        <div className='bg-white rounded-xl shadow-md p-12 text-center'>
                            <Car className='w-12 h-12 text-zinc-300 mx-auto mb-3' />

                            <h1 className='text-lg font-medium text-zinc-900'>
                                No Bookings Yet.
                            </h1>

                            <p className='text-zinc-500 text-sm mt-1'>
                                When customer book rides, they'll appear here
                            </p>
                        </div>
                    )}

                    {!loading && filterBookings.length > 0 && (
                        <div className='space-y-4'>
                            {filterBookings.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className='bg-white rounded-xl border border-zinc-300 shadow-sm hover:shadow-md transition-all overflow-hidden'>
                                        <div className='flex items-center gap-3 p-4 bg-linear-to-r from-blue-100 to-indigo-300 border-b border-zinc-50'>
                                            <div className='w-12 h-12 rounded-full overflow-hidden bg-blue-200 border-2 border-white shadow-md shrink-0 flex items-center justify-center'>
                                                <User className='text-blue-600 w-7 h-7' />
                                            </div>

                                            <div className='flex-1'>
                                                {/* Name & bookingStatus */}
                                                <div className='flex items-center justify-between'>
                                                    <h3 className='font-semibold text-zinc-900'>
                                                        {b.user.name.toUpperCase() || "Customer Name"}</h3>
                                                    <span className={`px-2 py${getStatusColor(b.bookingStatus)}`}>{b.bookingStatus}</span>

                                                </div>

                                                {/* mobile number */}
                                                <div className='text-xs flex items-center mt-1 gap-1 text-zinc-600'>
                                                    <Phone className='w-3 h-3' />
                                                    <span>{b.userMobileNumber}</span>
                                                </div>
                                            </div>
                                        </div>
{/* vehicle model & number */}
                                        <div className='px-4 pt-3'>
                                            <div className="bg-zinc-50 rounded-lg p-2 flex items-center gap-2">
                                                {getVehicleIcon(b.vehicle.type)}
                                                <div className='text-xs text-zinc-600'>
                                                    {b.vehicle.modelName} . {b.vehicle.number || "Not assigned"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* pickup &  drop */}
                                        <div className='space-y-3 p-4'>
                                            <div className='flex items-start gap-3'>
                                                <div className='shrink-0 w-6 h-6 rounded-full bg-green-100 flex 
                                                items-center justify-center'>
                                                    <MapPin className='w-3 h-3 text-green-600'/>
                                                </div>
                                                <div className='flex-1'>
                                                    <span className='text-xs font-medium text-green-600 tracking-wider'>
                                                        PICK UP
                                                    </span>
                                                    <p className='text-sm text-zinc-700 mt-1 leading-relaxed'>
                                                        {b.pickupAddress}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                              <div className='flex items-start gap-3'>
                                                <div className='shrink-0 w-6 h-6 rounded-full bg-red-100 flex 
                                                items-center justify-center'>
                                                    <Navigation className='w-3 h-3 text-red-600'/>
                                                </div>
                                                <div className='flex-1'>
                                                    <span className='text-xs font-medium text-red-600 tracking-wider'>
                                                        DROP
                                                    </span>
                                                    <p className='text-sm text-zinc-700 mt-1 leading-relaxed'>
                                                        {b.dropAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                        {/* price & date */}
                                        <div className='flex items-center justify-between bg-zinc-50 border-t border-zinc-200 px-4 py-3'>
                                            <div className='flex items-center gap-2 text-sm text-zinc-600' >
                                                <Calendar className='w-4 h-4 text-zinc-600' />
                                                <span>{formatDate(b.createdAt?.toString()!)}</span>
                                            </div>
                                            <div className='flex items-center gap-1 font-semibold text-zinc-900'>
                                                <IndianRupee className='w-4 h-4' />
                                                <span>{b.fare}</span>
                                            </div>
                                        </div>

                                        {/* payment */}
                                        <div className='flex items-center justify-between px-4 py-3 border-t border-zinc-200'>
                                            <div className='flex items-center justify-between gap-2'>
                                                <span className='text-xs text-zinc-500'>Payment:</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${b.paymentStatus == 'paid'
                                                    ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>{b.bookingStatus}</span>
                                            </div>
                                            {(b.bookingStatus == 'completed'|| b.bookingStatus == 'started'||
                                                b.bookingStatus == 'confirmed'
                                             ) && (
    <button 
    onClick={()=>router.push(`/partner/active-ride`)}
    className='flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-200 cursor-pointer
    px-4 py-2 rounded-lg transition-colors'>
       <span> View Details</span>  <span><ChevronRight /></span>
    </button>
)}
                                        </div>

                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page