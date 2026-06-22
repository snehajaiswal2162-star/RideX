'use client'
import { ArrowLeft, BadgeCheck, CheckCircle, CircleDashed, CreditCard, Landmark, Phone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
const page = () => {


    const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/

    const router = useRouter()
    const [accountHolder, setAccountHolder] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [ifsc, setIfsc] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [upiId, setUpiId] = useState("")
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")


    const sanitarizeIFSC = ifsc.trim().toUpperCase()



    const isNameValid = accountHolder.trim().length >= 3
    const isAccountValid = accountNumber.trim().length >= 9
    const isIFSCValid = IFSC_REGEX.test(sanitarizeIFSC)
    const isMobileValid = mobileNumber.trim().length === 10


    console.log({ isMobileValid, isNameValid, isAccountValid, isIFSCValid })

    const canSubmit = isNameValid && isAccountValid && isIFSCValid && isMobileValid && !loading

    const handleBank = async () => {
        setLoading(true)
        setErr("")
        try {
            const { data } = await axios.post('/api/partner/onboarding/bank', {
                accountHolder, accountNumber, ifsc, upi: upiId, mobileNumber
            }, { withCredentials: true })
            setLoading(false)
            console.log(data)
             router.push("/")
        } catch (error: any) {
            setErr(error?.response?.data?.message || "Something went wrong")
            setLoading(false)
        }
    }

     const handleGetBank = async () => {

        try {

            const { data } = await axios.get(
                "/api/partner/onboarding/bank", { withCredentials: true}
            )

            setMobileNumber(data.mobileNumber ?? "")
            setAccountHolder(data.partnerBank?.accountHolder ?? "")
            setAccountNumber(data.partnerBank?.accountNumber ?? "")
            setIfsc(data.partnerBank?.ifsc ?? "")
            setUpiId(data.partnerBank?.upi ?? "")
            console.log(data)
             

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
handleGetBank()
}, [])

    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.15)]'
            >
                <div className='relative text-center' >
                    <button className='absolute top-0 left-0 h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer' onClick={() => router.back()}>
                        <ArrowLeft />
                    </button>

                    <p className='text-xs text-gray-400 font-medium'>Step 3 of 3</p>
                    <h1 className='text-2xl font-bold mt-1'>Bank & Payout Setup</h1>
                    <p className='text-xs text-gray-500 mt-2'>Used for partner payout</p>
                </div>

                <div className="mt-8 space-y-6">
                    {/* acc holder name */}
                    <div>
                        <label htmlFor="ahn" className="text-xs font-semibold text-gray-400">Account Holder Name</label>
                        <div className='flex items-center gap-3 mt-2'>
                            <div className='text-gray-400'><BadgeCheck size={18} /></div>
                            <input
                                type="text"
                                id="ahn"
                                placeholder='As per the records'
                                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isNameValid && accountHolder.trim().length > 0 ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}`}
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)} />
                        </div>
                        {!isNameValid && accountHolder.trim().length > 0 && <p className='mt-1 text-xs text-red-600'>Minimum 3 characters required</p>}
                    </div>

                    {/* acc number */}
                    <div>
                        <label htmlFor="an" className="text-xs font-semibold text-gray-400">Account Number</label>
                        <div className='flex items-center gap-3 mt-2'>
                            <div className='text-gray-400'><CreditCard size={18} /></div>
                            <input type="text" id="an" placeholder='Account Number' className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isAccountValid && accountNumber.trim().length > 0 ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}`}
                                value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                        </div>
                        {!isAccountValid && accountNumber.trim().length > 0 && <p className='mt-1 text-xs text-red-600'>Minimum 9 digits are required</p>}
                    </div>

                    {/* ifsc */}
                    <div>
                        <label htmlFor="ifsc" className="text-xs font-semibold text-gray-400">IFSC code</label>
                        <div className='flex items-center gap-3 mt-2'>
                            <div className='text-gray-400'><Landmark size={18} /></div>
                            <input type="text" id="ifsc" placeholder='IDFC0003456' className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isIFSCValid && ifsc.trim().length > 0 ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}`}
                                value={ifsc.toUpperCase()} onChange={(e) => setIfsc(e.target.value)} />
                        </div>
                        {!isIFSCValid && ifsc.trim().length > 0 && <p className='mt-1 text-xs text-red-600'>ABCD0XXXXXX</p>}
                    </div>

                    {/* mob number */}
                    <div>
                        <label htmlFor="mob" className="text-xs font-semibold text-gray-400">Modile Number</label>
                        <div className='flex items-center gap-3 mt-2'>
                            <div className='text-gray-400'><Phone size={18} /></div>
                            <input type="text" id="mob" placeholder='phone Number' className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isMobileValid && mobileNumber.trim().length > 0 ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}`}
                                value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                        </div>
                        {!isMobileValid && mobileNumber.trim().length > 0 && <p className='mt-1 text-xs text-red-600'>10 digits required</p>}
                    </div>

                    {/* upi */}
                    <div>
                        <label htmlFor="upi" className="text-xs font-semibold text-gray-400">UPI ID (optional) </label>
                        <div className='flex items-center gap-3 mt-2'>
                            <input type="text" id="upi" placeholder='idfc@upi.in' className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                                value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
                    <CheckCircle size={18} className="mt-1" />
                    <p>Bank details are verified before first payout.
                        This usually take 24-48 hours.
                    </p>
                </div>
                <p className='text-red-500 mt-1'>{err}</p>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-40 transition cursor-pointer"
                    onClick={handleBank}
                    disabled={!canSubmit || loading}
                    
                   
                >
                    {loading ? <CircleDashed className="animate-spin text-white" size={18} /> : "Continue" }
                </motion.button>

            </motion.div>
        </div>
    )
}

export default page
