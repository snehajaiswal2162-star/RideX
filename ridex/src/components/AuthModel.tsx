'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Loader, Lock, Mail, User, X } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'

type propType = {
  open: boolean
  onClose: () => void
}

const AuthModel = ({ open, onClose }: propType) => {
  type steptype = 'login' | 'signup' | 'otp'
  const [step, setStep] = useState<steptype>('signup')

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] =useState(false)
  const [err,setErr] = useState("")
  const [otp,setOtp] = useState(["","","","","",""])


  const handleSignup = async () =>{
    try {
      setLoading(true)
      const {data} = await axios.post('/api/auth/register',{name,email,password})
      setErr("")
      setStep('otp')
      console.log(data)
      setLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
      setErr(error.response?.data?.message ?? "SOMETHING WENT WRONG")
    } else {
      setErr("SOMETHING WENT WRONG")
    }
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    const response = await signIn("credentials",{
      email,password,redirect:true
    })
    console.log(response)
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await signIn("google")
  }

  const handleChangeOtp = async (index:number,value:string) => {
    if(!/^[0-9]?$/.test(value)) return
    const updated = [...otp]
    updated[index] = value
    setOtp(updated)

    if(value && index < otp.length-1){
      document.getElementById(`otp-${index+1}`)?.focus()
    }

    if(!value && index > 0){
      document.getElementById(`otp-${index-1}`)?.focus()
    }
  }

  const handleVerifyEmail = async () =>{
    try {
      setLoading(true)
      const {data} = await axios.post('/api/auth/verify-email',{email,otp:otp.join("")})
      setStep('login')
      console.log(data)
      setOtp(["","","","","",""])
      setErr("")
      setLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
      setErr(error.response?.data?.message ?? "SOMETHING WENT WRONG")
    } else {
      setErr("SOMETHING WENT WRONG")
    }
    }
  }

  if (!open) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.35)] text-black"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-black transition cursor-pointer"
          >
            <X />
          </button>

          <div className="mb-6 text-center">
            <h1 className="font-extrabold text-3xl tracking-widest">RideX</h1>
            <p className="mt-1 text-sm text-gray-400">
              Prenium Vehicle Booking
            </p>
          </div>

          <button className="w-full h-11 rounded-lg border border-black/20 flex items-center justify-center gap-3 font-semibold text-sm hover:bg-black hover:text-white transition cursor-pointer"
          onClick={handleGoogleLogin}
          >
            <Image
              src="/google.png"
              alt="google"
              width={20}
              height={20}
            />
            Continue with google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-black/10" />
            <div className="text-xs text-gray-300">OR</div>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          {/* LOGIN */}
          {step === 'login' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-xl font-semibold">Welcome back</h1>

              <div className="mt-5 space-y-4">
                <div className="flex items-center border border-black/20 rounded-lg px-4 py-3 gap-2">
                  <Mail size={20} className="text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent text-sm outline-none"
                    onChange={(e)=>setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div className="flex items-center border border-black/20 rounded-lg px-4 py-3 gap-2">
                  <Lock size={20} className="text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-transparent text-sm outline-none"
                     onChange={(e)=>setPassword(e.target.value)}
                    value={password}
                  />
                </div>

                {err && <p className='text-red-600'>*{err}</p>}

                <button className="w-full h-11 rounded-lg bg-black text-white font-semibold hover:text-gray-600 transition flex items-center justify-center cursor-pointer"
                onClick={handleLogin}
                disabled={loading}

                >
                  {loading ? <Loader size={25} className='animate-spin' color='white'/> : "Login"}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <span
                  onClick={() => setStep('signup')}
                  className="text-black hover:underline font-medium cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </motion.div>
          )}

          {/* SIGNUP */}
          {step === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-xl font-semibold">Create Account</h1>

              <div className="mt-5 space-y-4">
                <div className="flex items-center border border-black/20 rounded-lg px-4 py-3 gap-2">
                  <User size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full bg-transparent text-sm outline-none"
                     onChange={(e)=>setName(e.target.value)}
                    value={name}
                  />
                </div>

                <div className="flex items-center border border-black/20 rounded-lg px-4 py-3 gap-2">
                  <Mail size={20} className="text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent text-sm outline-none"
                     onChange={(e)=>setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div className="flex items-center border border-black/20 rounded-lg px-4 py-3 gap-2">
                  <Lock size={20} className="text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-transparent text-sm outline-none"
                     onChange={(e)=>setPassword(e.target.value)}
                    value={password}
                  />
                </div>

                {err && <p className='text-red-600'>*{err}</p>}

                <button className="w-full h-11 rounded-lg bg-black text-white font-semibold hover:text-gray-600 transition flex justify-center items-center cursor-pointer"
                onClick={handleSignup}
                disabled={loading}
                >
                  {loading ? <Loader size={25} className='animate-spin' color='white'/> : "Get OTP"}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <span
                  onClick={() => setStep('login')}
                  className="text-black hover:underline font-medium cursor-pointer"
                >
                  Login
                </span>
              </p>
            </motion.div>
          )}

          {/* OTP */}
          {step == 'otp' && (
            <motion.div
            key='otp'
            initial={{opacity:0,x:20}}
            animate={{opacity:1,x:0}}
            exit={{opacity:0,x:-20}}
            >
              <h2 className='text-xl font-semibold'>Email Verifiction</h2>
              <div className='mt-6 flex jusify-between gap-4 '>
                {otp.map((digit,index)=>(
                  <input
                  key={index}
                  value={digit}
                  id={`otp-${index}`}
                  maxLength={1}
                  onChange={(e)=>handleChangeOtp(index, e.target.value)}
                  className='w-10 h-11 sm:w-12 text-center text-lg font-semibold rounded-xl bg-white border border-black/20 outline-none focus:border-black'
                  />
                ))}
              </div>

              <button className='mt-6 w-full text-white bg-black font-semibold rounded-xl hover:bg-gray-900 transition h-11 cursor-pointer' onClick={handleVerifyEmail}>
                Verify and Create Account
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModel
