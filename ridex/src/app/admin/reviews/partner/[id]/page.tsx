'use client'
import { IUser } from '@/models/UserModel'
import { IVehicle } from '@/models/VehicleModel'
import axios from 'axios'
import { ArrowLeft, Car, CheckCircle2, Clock, FileText, XCircle, Landmark, ShieldCheck, CircleDashed } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AnimateCard from '@/components/AnimateCard'
import { IPartnerDocs } from '@/models/PartnerDocsModel'
import DocumentPreview from '@/components/DocumentPreview'
import { IPartnerBank } from '@/models/PartnerBankModel'
import { AnimatePresence, motion } from 'motion/react'

const page = () => {

  const params = useParams()
  const id = params.id
  

  const [data, setData] = useState<IUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const [vehicleDetails, setVehicleDetails] = useState<IVehicle | null>(null)
  const [partnerDocs, setPartnerDocs] = useState<IPartnerDocs | null>(null)
  const [partnerBank, setPartnerBank] = useState<IPartnerBank | null>(null)
  const [showApprove, setShowApprove] = useState<any>(false)
  const [showReject, setShowReject] = useState<any>(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [approveLoading, setApproveLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  const handleGetPartner = async () => {
    try {
      const { data } = await axios.get(`/api/admin/reviews/partner/${id}`)
      console.log(data)
      setData(data.partner)
      setVehicleDetails(data.vehicle)
      setPartnerDocs(data.partnerDocs)
      setPartnerBank(data.partnerBank)
      setLoading(false)
    } catch (error:any) {
      console.log(error.response.data.message)
    }
  }

  useEffect(() => {
    handleGetPartner()
  }, [])

  const handleGetApprove = async () => {
    setApproveLoading(true)
    try {
      const { data } = await axios.get(`/api/admin/reviews/partner/${id}/approve`)
      console.log(data)
      setApproveLoading(false)
      router.push("/")
    } catch (error:any) {
      console.log(error.response.data.message)
      setApproveLoading(false)
    }
  }

  const handleGetReject = async () => {
    setRejectLoading(true)
    try {
      const {data} = await axios.post(`/api/admin/reviews/partner/${id}/reject`,rejectionReason)
      console.log(data)
      setRejectLoading(false)
      router.push("/")
    } catch (error:any) {
      console.log(error.response.data.message)
      setRejectLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-500" >Partner Loading...</div>
    )
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <div className="sticky  top-0 z-40 backdrop-blur-sm bg-white/80 border-b">
        <div className="max-w-7xl mx-auto px-7 h-17 flex items-center gap-4">
          <button className="h-11 w-11 rounded-full flex items-center justify-center border hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </button>
          <div className='flex-1'>
            <div className='text-lg font-bold'>{data?.name}</div>
            <div className="text-sm text-gray-500">{data?.email}</div>
          </div>

          {
            data?.partnerStatus === "pending" ? (
              <div className='px-4 py-2 rounded-full text-sm font-semibold inline-text items-center gap-2 bg-yellow-200 text-yellow-800 flex'>
                <Clock size={20} /> Pending
              </div>
            )
              : data?.partnerStatus === "rejected" ? (
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

      <main className='max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10'>
        {/* left */}
        <div className='lg:col-span-2 space-y-8'>
          <AnimateCard title="Vehicle Details" icon={<Car size={20} />}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Type</span>
              <span className='font-semibold'>{vehicleDetails?.type || '-'}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Number</span>
              <span className='font-semibold'>{vehicleDetails?.number || '-'}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Model</span>
              <span className='font-semibold'>{vehicleDetails?.modelName || '-'}</span>
            </div>
          </AnimateCard>

          <AnimateCard title="Documents" icon={<FileText size={20} />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <DocumentPreview label={"Aadhaar"} url={partnerDocs?.aadharUrl} />
              <DocumentPreview label={"Registration Certificate"} url={partnerDocs?.rcUrl} />
              <DocumentPreview label={"Driving License"} url={partnerDocs?.licenseUrl} />
            </div>
          </AnimateCard>
        </div>
        {/* right */}
        <div className='space-y-8'>
          <AnimateCard title={"Bank Details"} icon={<Landmark size={20} />}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Holder</span>
              <span className='font-semibold'>{partnerBank?.accountHolder || '-'}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Number</span>
              <span className='font-semibold'>{partnerBank?.accountNumber || '-'}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IFSC Code</span>
              <span className='font-semibold'>{partnerBank?.ifsc || '-'}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">UPI Id</span>
              <span className='font-semibold'>{partnerBank?.upi || '-'}</span>
            </div>
          </AnimateCard>

          {data?.partnerStatus === "pending" && (
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
              <h2 className="text-lg font-bold">Approve Partner?</h2>
              <p className="text-gray-400 text-sm">Confirm all informaion has been verified.</p>

              <div className="flex gap-4 mt-7">
                <button className="flex-1 py-2 rounded-xl border cursor-pointer" onClick={()=>setShowApprove(false)}>Cancel</button>
                <button className="flex-1 py-2 rounded-xl bg-black/90 text-white cursor-pointer flex items-center justify-center" 
                onClick={handleGetApprove} 
                disabled={approveLoading}>{approveLoading ? <CircleDashed className="text-white animate-spin" size={14} /> : 'Yes, Approve'}
                </button>
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
              <h2 className="text-lg font-bold">Reject Partner?</h2>
              <p className="text-gray-400 text-sm">
                <textarea className="w-full mt-3 border rounded-xl p-3 text-sm" placeholder="Enter rejection reason (required)"
                value={rejectionReason} onChange={(e)=>setRejectionReason(e.target.value)}
                ></textarea>
              </p>

              <div className="flex gap-4 mt-7">
                <button className="flex-1 py-2 rounded-xl border cursor-pointer" onClick={()=>setShowReject(false)}>Cancel</button>
                <button className="flex-1 py-2 rounded-xl bg-black/90 text-white flex items-center justify-center cursor-pointer" onClick={handleGetReject} disabled={rejectLoading}>{rejectLoading ? <CircleDashed className='text-white animate-spin' size={14} /> : 'Reject'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default page
