'use client'
import { useParams, useRouter, } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, CheckCircle2, CircleDashed, Clock, ImageIcon, IndianRupee, ShieldCheck, Truck, XCircle } from 'lucide-react'
import { IUser } from '@/models/UserModel'
import { vehicleType } from '@/models/VehicleModel'
import { AnimatePresence, motion } from 'motion/react'
import AnimateCard from '@/components/AnimateCard'

interface IVehicle {
  owner: IUser
  type: vehicleType
  modelName: string
  number: string
  imageUrl?: string
  baseFare?: number
  pricePerKm?: number
  waitingCharge?: number
  status: "approved" | "pending" | "rejected"
  rejectionReason?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const page = () => {
  const { id } = useParams()

  const [data, setData] = useState<IVehicle | null>(null)
  const router = useRouter()

  const [showApprove, setShowApprove] = useState(false)
  const [showReject, setShowReject] = useState(false)

  const [rejectionReason,setRejectionReason] = useState("")

  const [approveLoading,setApproveLoading] = useState(false)
  const [rejectLoading,setRejectLoading] = useState(false)

  const handleGetApprove = async () => {
    setApproveLoading(true)
    try{
const {data} = await axios.get(`/api/admin/reviews/vehicle/${id}/approve`,{withCredentials:true})
console.log(data)
setApproveLoading(false)
router.push('/')
    }catch(error:any){
      console.log(error.response.data.message)
      setApproveLoading(false)

    }
  }

   const handleGetReject = async () => {
    setRejectLoading(true)
    try{
const {data} = await axios.post(`/api/admin/reviews/vehicle/${id}/reject`,{reason:rejectionReason},{withCredentials:true})
console.log(data)
setRejectLoading(false)
router.push('/')
    }catch(error:any){
      console.log(error.response.data.message)
      setRejectLoading(false)

    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const result = await axios.get(`/api/admin/reviews/vehicle/${id}`,{withCredentials:true})
        console.log(result.data)
        setData(result.data.vehicle)
      } catch (error:any) {
        console.log(error.response.data.message)
      }
    }
    load()
  }, [id])
  return (
    <div>
      <div className="sticky  top-0 z-40 backdrop-blur-sm bg-white/80 border-b">
        <div className="max-w-7xl mx-auto px-7 h-17 flex items-center gap-4">
          <button className="h-11 w-11 rounded-full flex items-center justify-center border hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </button>
          <div className='flex-1'>
            <div className='text-lg font-bold'>{data?.owner?.name}</div>
            <div className="text-sm text-gray-500">{data?.owner?.email}</div>
          </div>

          {
            data?.status === "pending" ? (
              <div className='px-4 py-2 rounded-full text-sm font-semibold inline-text items-center gap-2 bg-yellow-200 text-yellow-800 flex'>
                <Clock size={20} /> Pending
              </div>
            )
              : data?.status === "rejected" ? (
                <div className='px-4 py-2 rounded-full text-sm font-semibold inline-text items-center gap-2 bg-red-200 text-red-800 flex'>
                  <XCircle size={20} /> Rejected
                </div>
              )
                : (
                  <div className='px-4 py-2 rounded-full text-sm font-semibold inline-text items-center gap-2 bg-green-200 text-green-800 flex'>
                    <CheckCircle2 size={20} /> Approved
                  </div>
                )

          }
        </div>
      </div>

      <main>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='rounded-3xl shadow-xl bg-white overflow-hidden '
        >
          {data?.imageUrl ? (
            <img src={data.imageUrl} alt='vehicle' className='w-full h-[450px] object-cover ' />
          ) : (
            <div className='h-[450px] grid place-items-center text-gray-300 '>
              <ImageIcon size={25} />
            </div>
          )}
        </motion.div>

        <div className="space-y-8">
          <AnimateCard
            title={"Vehicle Details"}
            icon={<Truck size={20} />}
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Type</span>
              <span className='font-semibold'>{data?.type || '-'}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Number</span>
              <span className='font-semibold'>{data?.number || '-'}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Model</span>
              <span className='font-semibold'>{data?.modelName || '-'}</span>
            </div>
          </AnimateCard>

          <AnimateCard
            title={"Pricing Configuration"}
            icon={<IndianRupee size={20} />}
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Base Fare</span>
              <span className='font-semibold flex items-center'><IndianRupee size={12} />{data?.baseFare || 0}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price per KM</span>
              <span className='font-semibold flex items-center'><IndianRupee size={12} />{data?.pricePerKm || 0}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Waiting Charge</span>
              <span className='font-semibold flex items-center'><IndianRupee size={12} />{data?.waitingCharge || 0}</span>
            </div>
          </AnimateCard>

            {data?.status === "pending" && (
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white rounded-4xl p-8 shadow-xl space-y-6'
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          <ShieldCheck size={20} /> Admin Check
                        </div>
                        <p className="text-sm text-gray-500">Verify documents before approving it</p>
          
                        <div className="flex flex-col gap-4" >
                          <button className="py-3 rounded-2xl text-white bg-linear-to-br from-black to-gray-800 txt-white font-semibold hover:opacity-90 transition cursor-pointer" onClick={() => setShowApprove(true)}>Approve</button>
                          <button className="py-3 rounded-2xl border border-gray-900 font-semibold hover:bg-gray-200 transition cursor-pointer" onClick={() => setShowReject(true)}>Reject</button>
                        </div>
                      </motion.div>
                    )}
        </div>
      </main>

       {/* approve */}
      <AnimatePresence>
        {showApprove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center backdrop-blur fixed inset-0 px-4 bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-4xl p-6 w-full max-w-sm"
            >
              <h2 className="text-lg font-bold">Approve Vehicle?</h2>
              <p className="text-gray-400 text-sm">Confirm all informaion has been verified.</p>

              <div className="flex gap-4 mt-7">
                <button className="flex-1 py-2 rounded-xl border cursor-pointer" onClick={()=>setShowApprove(false)}>Cancel</button>
                <button className="flex-1 py-2 rounded-xl bg-black/90 text-white cursor-pointer flex items-center justify-center" onClick={handleGetApprove} disabled={approveLoading}>{approveLoading ? <CircleDashed className="text-white animate-spin" size={14} /> : 'Yes, Approve'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* reject button */}
      <AnimatePresence>
        {showReject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center backdrop-blur fixed inset-0 px-4 bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-4xl p-6 w-full max-w-sm"
            >
              <h2 className="text-lg font-bold">Reject Vehicle?</h2>
              <p className="text-gray-400 text-sm">
                <textarea className="w-full mt-3 border rounded-xl p-3 text-sm" placeholder="Enter rejection reason (required)"
                value={rejectionReason} onChange={(e)=>setRejectionReason(e.target.value)}
                ></textarea>
              </p>

              <div className="flex gap-4 mt-7">
                <button className="flex-1 py-2 rounded-xl border cursor-pointer" onClick={()=>setShowReject(false)}>Cancel</button>
                <button className="flex-1 py-2 rounded-xl bg-black/90 text-white cursor-pointer  flex items-center justify-center" onChange={handleGetReject} disabled={rejectLoading}>{rejectLoading ? <CircleDashed className='text-white animate-spin' size={14} /> : 'Reject'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default page
