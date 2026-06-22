'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, CircleDashed, FileCheck, UploadCloudIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type docsType = "aadhar" | "license" | 'rc'

const Page = () => {

    const handleImage = async (doc: docsType, file: File | null) => {
        setDocs(prev => ({ ...prev, [doc]: file }))
    }

     const [err,setErr] = useState("")
            const [loading,setLoading] = useState(false)

    const handleDocs = async () => {
        try {
            setLoading(true)
            setErr("")
            const formData = new FormData()
            if(!docs.aadhar || !docs.license || !docs.rc) {
                setErr("All documents are required")
                setLoading(false)
                return null
            }
            formData.append("aadhar",docs.aadhar)
            formData.append("license",docs.license)
            formData.append("rc",docs.rc)
            const { data } = await axios.post("/api/partner/onboarding/documents", formData)
            console.log(data)
            setLoading(false)
            router.push('/')
        } catch (error:any) {
            setErr(error?.response?.data?.message || "Something went wrong")
            setLoading(false)

        }
    }

    const router = useRouter()
    const [docs, setDocs] = useState<Record<docsType, File | null>>({
        aadhar: null,
        license: null,
        rc: null
    })

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

                    <p className='text-xs text-gray-400 font-medium'>Step 2 of 3</p>
                    <h1 className='text-2xl font-bold mt-1'>Upload Documents</h1>
                    <p className='text-xs text-gray-500 mt-2'>Required from verification</p>
                </div>

                <div className='mt-8 space-y-5'>
                    {/* aadhar */}
                    <motion.label
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition mb-5'
                    >
                        {/* left */}
                        <div>
                            <p className="text-sm font-semibold">Aadhaar / ID proof</p>
                            <p className="text-xs text-gray-500">Government issue ID</p>
                        </div>

                        {/* right */}
                        <div  className='flex justify-end items-center gap-3 max-w-35 '>
                            {docs.aadhar ? (
                                <span className="text-xs text-gray-400 max-w-11 text-right truncate ">{docs.aadhar.name}</span>
                            ): <span className="text-xs text-gray-400">Upload</span>
                            }
                            
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white shrink-0 "><UploadCloudIcon size={18} /></div>
                        </div>
                        <input type='file' accept='image/*,.pdf' hidden onChange={(e) => handleImage("aadhar", e.target.files?.[0] || null)} />
                    </motion.label>

                    {/* driving license */}
                    <motion.label
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition mb-5'
                    >
                        {/* left */}
                        <div>
                            <p className="text-sm font-semibold">Driving License</p>
                            <p className="text-xs text-gray-500">valid driving license</p>
                        </div>

                        {/* right */}
                        <div className="flex justify-end items-center gap-3 max-w-35 ">
                           {docs.license ? (
                                <span className="text-xs text-gray-400 max-w-11 text-right truncate ">{docs.license.name}</span>
                            ): <span className="text-xs text-gray-400">Upload</span>
                            }
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white shrink-0"><UploadCloudIcon size={18} /></div>
                        </div>
                        <input type='file' accept='image/*,.pdf' hidden onChange={(e) => handleImage("license", e.target.files?.[0] || null)} />
                    </motion.label>

                    {/* Rc */}
                    <motion.label
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition mb-5'
                    >
                        {/* left */}
                        <div>
                            <p className="text-sm font-semibold">Vehicle RC</p>
                            <p className="text-xs text-gray-500">RC Proof</p>
                        </div>

                        {/* right */}
                        <div className="flex justify-end items-center gap-3 max-w-35 ">
                              {docs.rc ? (
                                <span className="text-xs text-gray-400 max-w-11 text-right truncate ">{docs.rc.name}</span>
                            ): <span className="text-xs text-gray-400">Upload</span>
                            }
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white shrink-0"><UploadCloudIcon size={18} /></div>
                        </div>
                        <input type='file' accept='image/*,.pdf' hidden onChange={(e) => handleImage("rc", e.target.files?.[0] || null)} />
                    </motion.label>

                </div>

                <div className='mt-6 flex items-center gap-3 text-xs text-gray-400'>
                    <FileCheck className='mt-1' size={18} />
                    <p>Documents are securely stored and manually store by our team.</p>
                </div>

                <p className="text-red-500 mt-1">{err}</p>

                <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-40 transition cursor-pointer"
                    onClick={handleDocs}
                >
                     {loading ? <CircleDashed className="animate-spin text-white" size={18}/> : "Continue"}
                </motion.div>


            </motion.div>
        </div>
    )
}

export default Page
