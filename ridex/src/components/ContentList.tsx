'use client'
import React, { useEffect } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, CheckCircle2, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const ContentList = ({ data, type }: any) => {

    const router = useRouter()
    const handleStartVidekyc = async (id:any) => {
        try {
            const result  = await axios.get(`/api/admin/videoKyc/start/${id}`)
            window.location.reload()
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    

    if (data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl py-16 text-center border border-dashed border-gray-200 shadow-sm"
            >
                <div className='w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5'>
                    <CheckCircle2 size={25} className='text-green-500' />
                </div>
                <p className="font-bold text-lg text-gray-900">All Caught Up!</p>
                <p className="text-gray-500 text-sm">No pending reviews to display.</p>
            </motion.div>
        )
    }
    return (
        <div className="space-y-3">
            <div className='flex items-center justify-between px-1 mb-1'>
                <p className="text-sm font-semibold uppercase text-gray-500 tracking-tight">
                    {type === "partner" ? "Pending partner reviews" : type === "kyc" ? "pending video kyc" : "pending vehicle reviews"}
                </p>
                <p className="text-sm text-gray-500">{data.length} items</p>
            </div>
            {data.map((item: any, index: number) => {
                 console.log("ITEM:", item);
          const name = item?.owner?.name || item?.name || "Unknown"
const email = item?.owner?.email || item?.email || "No email"
                return (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 13 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0,0,0,0.10)" }}
                        className='bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-2 shadow-sm transition-shadow'
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-purple-100 text-purple-700">{name?.charAt(0).toUpperCase() ?? <Users size={16} />}</div>
                            <div className="min-w-0">
                                <p className='font-bold text-sm text-gray-900 truncate '>{name}</p>
                                <p className='text-sm text-gray-400 truncate'>{email}</p>
                            </div>
                        </div>
                        <div className="shrink-0">
                            {item.videoKycStatus === "pending" ? (
                                <motion.button
                                    whileTap={{ scale: 0.96, x: 10 }}
                                    className='flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-white text-sm font-semibold transition-colors cursor-pointer'
                                    onClick={()=>handleStartVidekyc(item._id)}
                                >
                                    Start Video Kyc <ArrowRight size={16} />
                                </motion.button>
                            ) : item.videoKycStatus === "in_progress" ? (
                                <motion.button
                                    whileTap={{ scale: 0.96, x: 10 }}
                                    className='flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-white text-sm font-semibold transition-colors cursor-pointer'
                                    onClick={()=>router.push(`/video-kyc/${item.videoKycRoomId}`)}
                                >
                                    Join Call <ArrowRight size={16} />
                                </motion.button>
                            ) : (
                                <motion.button
                                whileTap={{ scale: 0.96, x: 10 }}
                                className='flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-white text-sm font-semibold transition-colors cursor-pointer'
                                onClick={() => router.push(`/admin/reviews/${type}/${item._id}`)}
                            >
                                Reviews <ArrowRight size={16} />
                            </motion.button>

                            )}
                       

                        </div>


                    </motion.div>
                )
            })}
        </div>
    )
}

export default ContentList
