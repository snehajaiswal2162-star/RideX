'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { motion } from 'motion/react'
import { ArrowRight, Check, Clock, Lock, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RejectionCard from './RejectionCard';
import StatusCard from './StatusCard';
import ActionCard from './ActionCard';
import axios from 'axios';
import PricingModel from './PricingModel';
import { IVehicle } from '@/models/VehicleModel';
import PartnerEarning from './PartnerEarning';

type Step = {
  id: number,
  title: string,
  route?: string,
}

const STEPS: Step[] = [
  { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
  { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
  { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
  { id: 4, title: "Review" },
  { id: 5, title: "Video KYC" },
  { id: 6, title: "Pricing" },
  { id: 7, title: "Final Review" },
  { id: 8, title: "Live" },
];

// route:`/admin/reviews/partner/${id}`

const TOTAL_STEPS = STEPS.length

const PartnerDashboard = () => {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [requestLoading, setRequestLoading] = useState(false)
  const { userData } = useSelector((state: RootState) => state.user)

  const [showpricing, setShowPricing] = useState(false)
  const [vehicleDetails, setVehicleDetails] = useState<IVehicle | null>(null)
  useEffect(() => {
    if (userData) {
      setActiveStep(userData.partnerOnBoardingSteps + 1)
    }
  }, [userData])

  const progressPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100

  const goToStep = (step: Step) => {

    if (step.id == 6 && userData?.partnerStatus == "approved" && userData?.videoKycStatus == "approved") {
      setShowPricing(true)
      return
    }

    if (step.route && step.id <= activeStep) {
      router.push(step.route)
    }
  }

  const handleGetPricing = async () => {
    try {
      const { data } = await axios.get('/api/partner/onboarding/pricing')
      console.log(data)
      setVehicleDetails(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetPricing()
  }, [])

  console.log("activeStep:", activeStep);
console.log("vehicleDetails:", vehicleDetails);
console.log("status:", vehicleDetails?.status);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-200 to-gray-300 px-4 pt-28 pb-20  ">
      <div className='max-w-7xl mx-auto pb-20'>
        <div>
          <h1 className='text-3xl font-bold'>Partner Dashboard</h1>
          <p className='text-gray-400 mt-3'>Complete all the steps to activate your account.</p>
        </div>

        <div className='bg-white rounded-3xl mt-10 p-10 shadow-xl border overflow-x-auto'>
          <div className='relative max-w-400'>
            <div className='absolute top-7 left-0 w-full h-1 bg-gray-200 rounded-full ' />
            <motion.div
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className='absolute top-7 left-0 h-1 bg-black rounded-full'
            />
            <div className="relative flex justify-between">
              {STEPS.map((s, i) => {
                const completed = s.id < activeStep
                const active = s.id == activeStep
                const locked = s.id > activeStep
                return (
                  <motion.div
                    key={s.id}
                    whileHover={locked ? {} : { scale: 1.1 }}
                    className='flex flex-col items-center z-10 cursor-pointer'
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 ${completed ? "bg-black border-black text-white" : active ? "border-black bg-white " : "border-gray-300 text-gray-400 bg-white"}`}
                      onClick={() => goToStep(s)}
                    >
                      {completed ? <Check size={20} /> : locked ? <Lock size={20} /> : s.id}
                    </div>

                    <p className='mt-3 font-semibold text-center text-sm '>{s.title}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {
          activeStep == 4 && userData?.partnerStatus === "rejected" && (
            <RejectionCard
              title={"partner Rejection Details"}
              reason={userData?.rejectionReason}
              actionLabel={"Review & Update"}
              onAction={() => {
                router.push(`/partner/onboarding/vehicle`)
              }}
            />
          )
        }

        {
          activeStep == 4 && userData?.partnerStatus == "pending" && (
            <StatusCard
              icon={<Clock size={18} />}
              title={`Documents under reviews`}
              desc={`Admin is verifying the documents`}
            />
          )
        }

        {activeStep == 5 && (
          userData?.videoKycStatus == "approved" ? (
            <StatusCard
              icon={<Check size={18} />}
              title={"Vieo Kyc Approved"}
              desc={"You can proceed to pricing"}
            />
          ) : userData?.videoKycStatus == "rejected" ? (
            <RejectionCard
              title={'Video Kyc Rejected'}
              reason={userData?.rejectionReason}
              actionLabel={`${requestLoading ? "Requesting..." : 'Request Again'}`}
              onAction={
                async () => {
                  setRequestLoading(true)
                  await axios.get("/api/partner/video-kyc/request")
                  setRequestLoading(false)
                }
              }
            />
          ) : userData?.videoKycStatus == "in_progress" ? (
            <ActionCard
              icon={<Video size={18} />}
              title={"Admin Started Video Kyc"}
              button={"Join now"}
              onClick={() => router.push(`/video-kyc/${userData?.videoKycRoomId}`)}
            />
          ) : (
            <StatusCard
              icon={<Clock size={18} />}
              title={"Waiting for admin"}
              desc={"Admin will intiate video kyc shortly."}
            />
          )
        )
        }

        {
          activeStep == 7 && vehicleDetails?.status == "pending" && (
            <StatusCard
              icon={<Clock size={20} />}
              title="Pricing Under review"
              desc={"Admin is reviewing the pricing"}
            />)
}

{
        activeStep == 7 && vehicleDetails?.status == "rejected" && (
          <RejectionCard
            title="Pricing Rejected"
            reason={vehicleDetails?.rejectionReason}
            actionLabel="Edit & Resubmit"
            onAction={() => setShowPricing(true)}
          />
        )

}

{
  activeStep == 8 && vehicleDetails?.status == "approved" &&  (
    <motion.div
    initial={{opacity:0, y:30}}
    animate={{opacity:1, y:0}}
    className='bg-black rounded-3xl p-5 text-white shadow-2xl mt-10'
    >
      <h2 className='text-lg font-semibold'>🚀 You're Live</h2>
      <button className='mt-6 bg-white text-black rounded-xl flex items-center gap-2 px-6 py-3'>
        Go to Bookings <ArrowRight size={18}/>
      </button>
    </motion.div>
  )
}
<PartnerEarning />
      </div>

      <PricingModel
        open={showpricing}
        onClose={() => setShowPricing(false)}
        data={vehicleDetails}
      />
    </div>
  )
}

export default PartnerDashboard
