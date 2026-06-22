'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import { Video, VideoOff, MicOff, Mic, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'

const Page = () => {
  const { userData } = useSelector((state: RootState) => state.user)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const previewRef = useRef<HTMLVideoElement>(null)

  const [joined, setJoined] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const [isCameraOn, setisCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)

  const [loading, setLoading] = useState(false)
  const [aLoading, setALoading] = useState(false)
  const [rLoading, setRLoading] = useState(false)

  const [showApprovedModel, setShowApprovedModel] = useState(false)
  const [showRejectionModel, setShowRejectionModel] = useState(false)
  const [reason,setReason] = useState("")

  const router = useRouter()

  const { roomId } = useParams()
  useEffect(() => {
    if (joined) return

    const init = async () => {
      try {
        const localstream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        setStream(localstream)

      } catch (error) {
        console.log(error)
      }
    }

    init()
  }, [joined])

  useEffect(() => {
    if (previewRef.current && stream) {
      previewRef.current.srcObject = stream
    }
  }, [stream])

  const toggleCamera = () => {
    if (!stream) return

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !isCameraOn
    })

    setisCameraOn(!isCameraOn)
  }

  const toggleMic = () => {
    if (!stream) return

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !isMicOn
    })

    setIsMicOn(!isMicOn)
  }


 const handleApproved = async () => {
  setALoading(true)

  try {
    const { data } = await axios.post(
      "/api/admin/videoKyc/complete",
      {
        roomId,
        action: "approved"
      }
    )

    console.log(data)
    router.push('/')
  } catch (error) {
    console.log(error)
  } finally {
    setALoading(false)
  }
}



  const handleRejected = async () => {
    setRLoading(true)
    try {
      const { data } = await axios.post("/api/admin/videoKyc/complete", { roomId, action: "rejected", reason })
      console.log(data)
      setRLoading(false)
      router.push('/')
    } catch (error) {
      console.log(error)
      setRLoading(false)
    }
  }

  const startCall = async () => {
    if (!containerRef.current || !userData?._id || !roomId) return

    setLoading(true)

    const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt')

    const appId = Number(process.env.NEXT_PUBLIC_ZEGO_CLOUD_APP_ID)
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_CLOUD_SERVER_SECRET

    if (!appId || !serverSecret) {
      console.error("Missing Zego credentials")
      return
    }

    const displayName = userData?.role === "admin" ? "Admin" : `${userData?.name} (${userData?.email})`

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId.toString(),
      userData._id.toString(),
      // userData.name || "User"
      displayName
    )

    const zp = ZegoUIKitPrebuilt.create(kitToken)

    setJoined(true)

    zp.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
    })
  }
  // gpt code
//   const startCall = async () => {
//   console.log("Join Call button clicked")

//   console.log("containerRef:", containerRef.current)
//   console.log("user id:", userData?._id)
//   console.log("roomId:", roomId)

//   try {
//     setLoading(true)

//     const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt')

//     console.log("Zego imported successfully")

//     const appId = Number(process.env.NEXT_PUBLIC_ZEGO_CLOUD_APP_ID)
//     const serverSecret = process.env.NEXT_PUBLIC_ZEGO_CLOUD_SERVER_SECRET

//     console.log("appId:", appId)
//     console.log("serverSecret:", serverSecret)

//     if (!appId || !serverSecret) {
//       console.log("Missing env variables")
//       return
//     }

//     const displayName =
//       userData?.role === "admin"
//         ? "Admin"
//         : `${userData?.name} (${userData?.email})`

//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       appId,
//       serverSecret,
//        roomId.toString(),
//       userData!._id.toString(),
//       displayName
//     )

//     console.log("Kit token generated")

//     const zp = ZegoUIKitPrebuilt.create(kitToken)

//     console.log("Zego instance created")

//     setJoined(true)

//     setTimeout(() => {
//       console.log("Trying to join room")

//       if (!containerRef.current) {
//         console.log("containerRef missing")
//         return
//       }

//       zp.joinRoom({
//         container: containerRef.current,
//         scenario: {
//           mode: ZegoUIKitPrebuilt.OneONoneCall,
//         },
//         showPreJoinView: false,
//       })

//       console.log("joinRoom executed")
//     }, 100)

//   } catch (error) {
//     console.log("ERROR:", error)
//   } finally {
//     setLoading(false)
//   }
// }

  return (
    <div className='bg-black text-white min-h-screen flex flex-col'>

      {/* Header */}
      <div className='px-6 py-2 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <Image src="/logo.png" alt="logo" width={60} height={60} />

          <p className='text-sm text-gray-300'>
            {userData?.role === "admin"
              ? "Admin verification"
              : "Partner video kyc"}
          </p>
        </div>
      </div>

      {joined && (
        <div className='flex flex-wrap gap-3'>
          {userData?.role === "admin" && (
            <>
              <button
                onClick={() => setShowApprovedModel(true)}
                className='flex items-center gap-2 text-sm rounded-full px-4 py-2 bg-green-500 hover:bg-green-700 cursor-pointer'>
                Approved
              </button>
              <button
                onClick={() => setShowRejectionModel(true)}
                className='flex items-center gap-2 text-sm rounded-full px-4 py-2 bg-orange-500 hover:bg-orange-700 cursor-pointer'>
                Reject
              </button>
            </>
          )}
          <button className='flex items-center gap-2 text-sm rounded-full px-4 py-2 bg-red-500 hover:bg-red-700 cursor-pointer' onClick={()=>router.push('/')}>End Call</button>
        </div>
      )}

      {/* Body */}
      <div className='flex-1 relative'>
        <div ref={containerRef} className={`absolute inset-0 ${joined ? "block" : "hidden"}`} />
        {!joined ? (

          <div className='h-full flex flex-col lg:flex-row items-center justify-between gap-10 px-6 py-10'>

            {/* LEFT */}
            <div className='w-full lg:w-1/2 flex justify-center'>
              <div className='w-full max-w-2xl relative rounded-2xl overflow-hidden border border-white/10 bg-white/5'>

                <video
                  autoPlay
                  muted
                  playsInline
                  ref={previewRef}
                  className='w-full h-[300px] sm:h-[450px] object-cover'
                />

              </div>
            </div>

            {/* RIGHT */}
            <div className='w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8'>

              <h1 className='text-3xl sm:text-5xl font-bold leading-tight'>
                Secure Video KYC
              </h1>

              <p className='text-gray-400 max-w-md'>
                Please enable your camera and microphone before joining the call.
              </p>

              <div className='flex items-center gap-6'>

                {/* Camera */}
                <button
                  onClick={toggleCamera}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition cursor-pointer
                  ${isCameraOn
                      ? "bg-white text-black"
                      : "bg-white/10 border border-white/10"
                    }`}
                >
                  {isCameraOn ? <Video /> : <VideoOff />}
                </button>

                {/* Mic */}
                <button
                  onClick={toggleMic}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition cursor-pointer
                  ${isMicOn
                      ? "bg-white text-black"
                      : "bg-white/10 border border-white/10"
                    }`}
                >
                  {isMicOn ? <Mic /> : <MicOff />}
                </button>

              </div>

              <button
                onClick={startCall}
                className='px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition cursor-pointer'
                disabled={loading}
              >
                {loading ? "Connecting..." : "Join Call"}
              </button>

            </div>

          </div>

        ) : (

          <div
            ref={containerRef}
            className='w-full h-full'
          />

        )}

      </div>
{/* approved button */}
<AnimatePresence>
  {showApprovedModel && (
 <motion.div
  initial={{opacity:0}}
  animate={{opacity:1}}
  exit={{opacity:0}}
  className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'
  >
    <motion.div
    initial={{scale:0.9}}
    animate={{scale:1}}
    className='relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl '
    >
<button className='absolute top-4 right-4 text-gray-400 cursor-pointer' onClick={()=>setShowApprovedModel(false)}><X size={16}/></button>
<h1 className='text-lg font-semibold mb-4'>
  Confirm Approve
</h1>
<div className='flex gap-4'>
<button className='flex-1 rounded-xl border py-2 cursor-pointer' onClick={()=>setShowApprovedModel(false)}>Cancel</button>
<button className='flex-1 bg-green-500 py-2 rounded-x cursor-pointerl' disabled={aLoading} onClick={handleApproved}>{aLoading ? "Processing..." : "Approved"}</button>
</div>
    </motion.div>
    
  </motion.div>
  )}
</AnimatePresence>

{/* reject button */}
<AnimatePresence>
  {showRejectionModel && (
 <motion.div
  initial={{opacity:0}}
  animate={{opacity:1}}
  exit={{opacity:0}}
  className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'
  >
    <motion.div
    initial={{scale:0.9}}
    animate={{scale:1}}
    className='relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl '
    >
<button className='absolute top-4 right-4 text-gray-400 cursor-pointer' onClick={()=>setShowRejectionModel(false)}><X size={16}/></button>
<h1 className='text-lg font-semibold mb-4'>
  Reject partner
</h1>
<textarea value={reason} onChange={(e)=>setReason(e.target.value)} placeholder="Give Rejection reason" className="w-full bg-white/10 border-white/20 rounded-xl p-3 mb-4 text-sm"/>
<div className='flex gap-4'>
<button className='flex-1 rounded-xl border py-2 cursor-pointer' onClick={()=>setShowRejectionModel(false)}>Cancel</button>
<button className='flex-1 bg-green-500 py-2 rounded-xl cursor-pointer' disabled={rLoading} onClick={handleRejected}>{rLoading ? "Processing..." : "Rejected"}</button>
</div>
    </motion.div>
    
  </motion.div>
  )}
</AnimatePresence>
    </div>
  )
}

export default Page