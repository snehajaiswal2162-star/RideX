'use client'
import { AnimatePresence, motion } from 'motion/react'
import { Bike, Car, Clock, IndianRupee, MessageCircle, Phone, Truck, User } from 'lucide-react'
import React, { useEffect } from 'react'
import RideChat from './RideChat'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType?.toLowerCase()) {
        case 'bike':
            return <Bike className='text-white' size={20} />
        case 'auto':
            return <Car className='text-white' size={20} />
        case 'truck':
            return <Truck className='text-white' size={20} />
        case 'car':
        case 'loading':
        default:
            return <Car className='text-white' size={20} />
    }
}

const PanelContext = ({ displayDistance, displayEta, isActive, cfg, status, bookings, paymentStatus, canChat, chatOpen, onChatToggle, currentRole }: any) => {


    return (
        <div className='flex flex-col gap-3 px-4 py-5'>
            {isActive && (
            <div className='mx-5 lg:mx-6 grid grid-cols-2  gap-3'>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center gap-3">
                    <div className='w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center shrink-0'>
                        <Clock size={17} className='text-zinc-600' />
                    </div>

                    <div>
                        <p className='text-[10px] text-zinc-600 font-semibold uppercase tracking-widest'>ETA</p>
                        <p className='text-lg font-black text-zinc-900 leading-none mt-1'>{Math.round(displayEta)}
                            <span className='txet-xs font-normal text-zinc-400 ml-1'>min</span>
                        </p>
                    </div>
                </div>

                <div className='bg-zinc-900 flex items-center rounded-2xl p-4 gap-3'>
                    <div className='w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0'>
                        <IndianRupee size={17} className='text-white' />
                    </div>
                    <div>
                        <p className='text-[10px] tracking-widest uppercase font-semibold text-zinc-400'>Fare</p>
                        <p className='text-lg font-black text-white leading-none mt-1'>{bookings?.fare || "-"}</p>
                    </div>
                </div>
            </div>
            )}

            {bookings?.user && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='mx-5 lg:mx-6'
                >
                    <div className='bg-zinc-950 flex items-center gap-4 rounded-2xl p-4'>
                        <div className='relative shrink-0'>
                            <div className='w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800'>
                                <User size={25} className='text-zinc-300' />
                            </div>
                            <div className='absolute -right-1 -bottom-1 bg-emerald-300 w-3 h-3 rounded-full border-2 border-zinc-950' />
                        </div>


                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between gap-2'>
                                <p className='text-white font-bold text-base truncate'>{bookings?.user?.name || "Customer"}</p>
                                <div className='flex items-center bg-white/10 px-2 py-1 rounded-full shrink-0'>
                                    <IndianRupee size={10} className='text-amber-300' />
                                    <span className='text-white text-xs font-semibold'>{bookings?.fare}</span>
                                </div>
                            </div>

                            {bookings.paymentStatus && (
                                <div className='flex items-center gap-2 mt-2'>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                                        ${paymentStatus.cls ?? 'bg-zinc-700 text-zinc-30'}`}>{paymentStatus.label}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {isActive && (
                        <div className='mt-2 gap-2 flex'>
                            {bookings.userMobileNumber && (
                                <a href={`tel:${bookings.userMobileNumber}`}
                                    className={`flex items-center justify-center gap-2 bg-zinc-100 hover::bg-zinc-200 active:scale-[0.97] *:
                            rounded-xl transition-all to-zinc-950 py-3 text-sm font-semibold ${canChat ? 'flex-1' : 'w-full}'}`}>
                                    <Phone size={15} /> Call
                                </a>
                            )}

                            {canChat && (
                                <div
                                    onClick={onChatToggle}
                                    className={`flex-1 flex items-center justify-center gap-2 active:scale-[0.98] transition-all rounded-xl
                        py-3 text-sm font-semibold ${chatOpen ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-900 hover:bg-black text-zinc-200'}`}>
                                    <MessageCircle size={15} /> {chatOpen ? 'Close Chat' : "Message"}</div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            <AnimatePresence>
                {chatOpen && canChat && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className='mx-5 lg:mx-6 oerflow-hidden '
                    >
                        <div className='rounded-2xl overflow-hidden border border-zinc-200 min-h-[460px] flex flex-col'>
                            <RideChat currentRole={currentRole} bookingId={bookings._id} userName={bookings?.user?.name || "Customer"}
                                driverName={bookings?.driver?.name || "Driver"} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* vehicle name, type, number */}
            {bookings?.vehicle && (
                <div className='mx-5 lg:mx-6'>
                    <div className='bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center gap-3 '>
                        <div className='w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0'>
                            {getVehicleIcon(bookings.vehicle.type)}
                        </div>

                        <div className='flex-1 min-w-0'>
                            <p className='text-[10px] uppercase tracking-wider font-semibold text-zinc-400'>Your Vehicle</p>
                            <p className='text-sm font-bold text-zinc-900 truncate'>{bookings.vehicle.modelName ?? "Vehicle Model"}</p>
                        </div>

                        <div className='bg-zinc-900 px-3 py-1.5 shrink-0 rounded-lg'>
                            <p className='text-white text-xs font-black font-mono tracking-widest'>
                                {bookings.vehicle.number ?? "Vehicle Number"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* pickup & drop */}
            <div className='mx-5 lg:mx-6'>
                <div className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'>
                    <div className='flex gap-3 p-4 border-b border-zinc-100'>
                        <div className='flex items-center pt-1 flex-col shrink-0'>
                            <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow-md'/>
                            <div className='w-px bg-zinc-300 mt-1 ' style={{height:15}}/>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='font-bold text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5'>PickUp</p>
                            <p className='text-sm text-zinc-800 leading-snug'>{bookings?.pickupAddress}</p>
                        </div>
                    </div>
                </div>
            </div>

             <div className='mx-5 lg:mx-6'>
                <div className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden'>
                    <div className='flex gap-3 p-4 border-b border-zinc-100'>
                        <div className='flex items-center pt-1 flex-col shrink-0'>
                            <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow-md'/>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='font-bold text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5'>Drop</p>
                            <p className='text-sm text-zinc-800 leading-snug'>{bookings?.dropAddress}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PanelContext
