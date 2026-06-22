'use client'
import { IBooking, PaymentStatus } from '@/models/bookingModel'
import React from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, CheckCircle, IndianRupee, User } from 'lucide-react'
import { useRouter } from 'next/navigation'


const PAYMENT_BADGE: Record<PaymentStatus, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
    paid: { label: "Paid", cls: "bg-emerald-100 text-emerald-700" },
    cash: { label: "Cash", cls: "bg-zinc-100 text-zinc-700" },
    failed: { label: "Failed", cls: "bg-red-100 text-red-700" },
};

const CompleteScreen = ({ booking, role }: { booking: IBooking, role: string }) => {
    const router = useRouter()
    console.log("USER DATA:", booking.user)
    return (
        <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    className='h-screen w-full bg-zinc-900 flex flex-col overflow-y-auto'
>
    <div className='flex-1 flex flex-col items-center justify-center px-6 py-12'>
        <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='mb-8'
        >
            <div className='w-32 h-32 rounded-full bg-emerald-400/10 flex items-center justify-center'>
                <div className='w-24 h-24 rounded-full bg-emerald-400/20 flex items-center justify-center'>
                    <CheckCircle size={53} className='text-emerald-400' />
                </div>
            </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className='w-full max-w-md'
        >
            <p className='text-zinc-400 text-center mb-2 uppercase tracking-[0.18em] font-semibold text-xs'>
                Trip Complete
            </p>

            <h1 className='text-white text-3xl font-black mb-2 text-center'>
                Ride Completed!
            </h1>

            <p className='text-zinc-500 text-sm text-center mb-8'>
                {role === 'Driver'
                    ? 'You have successfully dropped the customer.'
                    : 'You have successfully been dropped by the driver.'}
            </p>

            <div className='bg-zinc-900 border border-zinc-800 p-6 mb-4 rounded-2xl'>
                <p className='text-zinc-400 text-[10px] uppercase tracking-widest mb-1 text-center font-semibold'>
                    Fare Collected
                </p>

                <p className='font-black text-3xl text-white flex items-center justify-center gap-1 mb-4'>
                    <IndianRupee size={28} />
                    {booking.fare}
                </p>

                <div className='flex items-center justify-center border-t border-zinc-800 pt-3 text-xs gap-3'>
                    <span className='text-zinc-500'>
                        Payment Status
                    </span>

                    <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold
                        ${PAYMENT_BADGE[booking.paymentStatus]?.cls ??
                            'text-zinc-300 bg-zinc-700'}`}
                    >
                        {PAYMENT_BADGE[booking.paymentStatus]?.label ??
                            booking.paymentStatus}
                    </span>
                </div>
            </div>

            {booking?.user && (
                <div className='bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center p-4 gap-3 mb-4'>
                    <div className='w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0'>
                        <User size={30} className='text-zinc-400' />
                    </div>

                    <div className='min-w-0'>
                        <p className='text-zinc-500 text-[10px] uppercase tracking-wider font-semibold'>
                            Customer
                        </p>

                        <p className='text-zinc-300 text-sm font-bold truncate'>
                            {(booking.user as { name?: string })?.name ?? 'User'}
                        </p>
                    </div>
                </div>
            )}

            <button
                onClick={() => router.push('/')}
                className='w-full border border-zinc-700 text-zinc-400 py-3 rounded-2xl text-sm font-semibold
                hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 cursor-pointer'
            >
                <ArrowLeft size={15} />
                Back to Home
            </button>
        </motion.div>
    </div>
</motion.div>
    )
}

export default CompleteScreen
