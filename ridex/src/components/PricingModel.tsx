'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ImagePlus, IndianRupee } from 'lucide-react';
import axios from 'axios';
import { IVehicle } from '@/models/VehicleModel'

type PropsType = {
  open: boolean,
  onClose: () => void,
  data: IVehicle | null

}
const PricingModel = ({ open, onClose, data }: PropsType) => {

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(data?.imageUrl || null)

  const [baseFare, setBaseFare] = useState("")
  const [pricePerKm, setPricePerKm] = useState("")
  const [waitingCharge, setWaitingCharge] = useState("")

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data) {
      setPreview(data?.imageUrl || null)
      setBaseFare(data?.baseFare?.toString() || "")
      setPricePerKm(data?.pricePerKm?.toString() || "")
      setWaitingCharge(data?.waitingCharge?.toString() || "")
    }
  }, [data])

  const handleSave = async () => {
    setLoading(true)
    try {
      const formdata = new FormData()

      formdata.append('baseFare', baseFare)
      formdata.append('pricePerKm', pricePerKm)
      formdata.append('waitingCharge', waitingCharge)

      if (image) {
        formdata.append('image', image)
      }

      const { data } = await axios.post('/api/partner/onboarding/pricing', formdata)
      console.log(data)
      setLoading(false)
      onClose()
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4'
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className='bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden'
          >
            <div className='p-6 border-b'>
              <h2 className=''>Pricing & Vehicle Image</h2>
            </div>

            <div className='p-6 space-y-6'>
              <label htmlFor='imageLabel' className="relative h-44 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer">
                {preview ? (
                  <img src={preview} className='w-full h-full absolute inset-0 object-cover rounded-2xl' />
                ) : (
                  <ImagePlus size={28} />
                )}

                <input
                  type='file'
                  accept='image/*'
                  id='imageLabel'
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImage(e.target.files[0])
                      setPreview(URL.createObjectURL(e.target.files[0]))
                    }
                  }}
                />
              </label>

              <div>
                <p className="text-lg font-semibold">Fare Base</p>
                <div className="flex items-center gap-2 border rounded-2xl px-4 py-3 bg-white">
                  <IndianRupee size={20} />
                  <input type="text" placeholder='base fare' value={baseFare} onChange={(e) => setBaseFare(e.target.value)} className='w-full outline-none' />
                </div>
              </div>

              <div>
                <p className="text-lg font-semibold">Price per KM</p>
                <div className="flex items-center gap-2 border rounded-2xl px-4 py-3 bg-white">
                  <IndianRupee size={20} />
                  <input type="text" placeholder='base fare' value={pricePerKm} onChange={(e) => setPricePerKm(e.target.value)} className='w-full outline-none' />
                </div>
              </div>

              <div>
                <p className="text-lg font-semibold">Waiting Charge</p>
                <div className="flex items-center gap-2 border rounded-2xl px-4 py-3 bg-white">
                  <IndianRupee size={20} />
                  <input type="text" placeholder='base fare' value={waitingCharge} onChange={(e) => setWaitingCharge(e.target.value)} className='w-full outline-none' />
                </div>
              </div>

            </div>

            <div className='border-t gap-3 p-6 flex'>
              <button className='flex-1 rounded-xl py-2 border cursor-pointer' onClick={onClose}>Cancel</button>
              <button className="bg-black text-white rounded-xl py-2 flex-1 cursor-pointer" disabled={loading} onClick={handleSave}>{loading ? "Saving..." : "Save"}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PricingModel
