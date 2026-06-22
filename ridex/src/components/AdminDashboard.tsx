'use client'
import axios from 'axios'
import { CheckCircle2, Clock, Truck, UserIcon, Users, Video, XCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Kpi from './Kpi'
import TabButton from './TabButton'
import { motion, AnimatePresence } from 'motion/react'
import ContentList from './ContentList'
import AdminEarning from './AdminEarning'

type Stats = {
  totalPartners: number,
  totalPendingPartner: number,
  totalApprovedPartner: number,
  totalRejectedPartner: number,
}

type Tab = "partner" | "kyc" | "vehicle"

const AdminDashboard = () => {

  const [stats, setStats] = useState<Stats | null>(null)
  const [activeTab, setActiveTab] = useState<Tab | null>("partner")
  const [partnerReviews, setPartnerReviews] = useState<any>([])
  const [pendingKyc, setPendingKyc] = useState<any>([])
  const [vehicleReviews, setVehicleReviews] = useState<any>([])

  const handleGetData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard', { withCredentials: true })
      console.log("Dashboard Data:", data)
      setStats(data.stats)
      setPartnerReviews(data.pendingPartnerReviews)
      setVehicleReviews(data.pendingVehicle || [])
      console.log("pending : ",data.pendingVehicle)
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    }
  }

  const handleGetPendingVideoKyc = async () => {
    try {
      const {data} = await axios.get(`/api/admin/videoKyc/pending`, {withCredentials:true})
      setPendingKyc(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetData()
    handleGetPendingVideoKyc()
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-200 to-gray-300 ">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-40">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={'/logo.png'} alt='logo' width={44} height={44} />
          </div>
          <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-gray-950 text-gray-50">
            <UserIcon size={17} /> Admin Dashboard
          </div>
        </div>

      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 space-x-6  ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-15">
          <Kpi label="Total Partners" value={stats?.totalPartners || 0} icon={<UserIcon />} variant={"totalPartners"} />
          <Kpi label="Pending Partners" value={stats?.totalPendingPartner || 0} icon={<CheckCircle2 />} variant={"pending"} />
          <Kpi label="Approved Partners" value={stats?.totalApprovedPartner || 0} icon={<Clock />} variant={"approved"} />
          <Kpi label="Rejected Partners" value={stats?.totalRejectedPartner || 0} icon={<XCircle />} variant={"rejected"} />
        </div>

        <div className='bg-white rounded-2xl p-2 shadow-lg border border-gray-300 flex flex-wrap gap-2 mb-15'>
        <TabButton active={activeTab==="partner"} count={partnerReviews.length ?? 0} icon={<Users size={16}/>} onClick={()=>setActiveTab("partner")}>PendingPartner Reviews</TabButton>
        <TabButton active={activeTab==="kyc"} count={pendingKyc.length ?? 0} icon={<Video size={16}/>} onClick={()=>setActiveTab("kyc")}>Pending Video KYC</TabButton>
        <TabButton active={activeTab==="vehicle"} count={vehicleReviews.length ?? 0} icon={<Truck size={16}/>} onClick={()=>setActiveTab("vehicle")}>Pending Vehicle Reviews</TabButton>
      </div>

<AnimatePresence>
  <motion.div
  key={activeTab}
  initial={{opacity:0, y:18}}
  animate={{opacity:1, y:0}}
  exit={{opacity:0, y:-10}}
  transition={{duration:0.4, ease:"easeInOut"}}
  className="space-y-3"
  >
{ activeTab === "partner" && <ContentList data={partnerReviews ?? []} type={"partner"} /> }
{ activeTab === "kyc" && <ContentList data={pendingKyc ?? []} type={"kyc"} /> }
{ activeTab === "vehicle" && <ContentList data={vehicleReviews ?? []} type={"vehicle"} /> }
  </motion.div>
</AnimatePresence>

<AdminEarning />
      </main>
    </div>
  )
}

export default AdminDashboard
