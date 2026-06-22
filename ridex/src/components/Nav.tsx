'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthModel from './AuthModel'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { Bike, Car, ChevronRight, LogOut, Truck, X, Menu } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { getSocket } from '@/lib/socket'


const Nav_Items = ['Home', 'Booking', 'About Us', 'Contact Us']

const Nav = () => {
  const pathname = usePathname()
  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { userData } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()

  const [pendingCount, setPendingCount] = useState(0)

  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    dispatch(setUserData(null))
    setProfileOpen(false)
  }

  const fetchCount = async () => {
    try{
const {data} = await axios.get('/api/partner/bookings/pending-request-count')
console.log(data)
setPendingCount(data)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    if(userData?.role == 'partner'){
      fetchCount()
    }
  },[userData?.role])

  useEffect(()=>{
    const socket = getSocket()
    socket.on('new-booking',(data)=>{
      setPendingCount(prev=>prev+1)
    })
    return ()=>{
      socket.off('new-booking')
    }
  },[])

  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] md:w-[87%] z-50 rounded-full bg-[#0B0B0B] shadow-[0_15px_50px_rgba(0,0,0,0.7)]"
      >
        {/* ADD h-16 and py-2 here */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Image src="/logo.png" alt="logo" width={50} height={50} />

          {/* ADD flex items-center gap-8 here */}
          <div className="items-center gap-8 hidden md:flex">
            {/* {userData?.role == 'partner' ? (
                <>
                <Link href={'/'}>Home</Link>
                <Link href={'/partner/pending-requests'}>Pending Requests</Link>
                <Link href={'/partner/bookings'}>Bookings</Link>
                <Link href={'/partner/active-ride'}>Active Rides</Link>
                </>
              ): {Nav_Items.map((i, index) => {
              let href */}
            {userData?.role === 'partner' ? (
              <>
                <Link href="/" className='relative text-sm font-medium text-gray-300 hover:text-white transition'>Home</Link>
                <Link  href="/partner/pending-requests" className='relative text-sm font-medium text-gray-300 hover:text-white transition'>Pending Requests
                                <span className='absolute -top-1 -right-3 w-4 h-4 text-black bg-white flex items-center justify-center text-xs rounded-full font-bold'>{pendingCount ?? 0}</span>
                </Link>
                <Link href="/partner/bookings" className='relative text-sm font-medium text-gray-300 hover:text-white transition'>Bookings</Link>
                <Link href="/partner/active-ride" className='relative text-sm font-medium text-gray-300 hover:text-white transition'>Active Rides</Link>
              </>
            ) : (
              Nav_Items.map((i, index) => {
                let href

                if (i === 'Home') {
                  href = '/'
                } else {
                  href = `/user/${i.toLowerCase().replace(/\s+/g, '-')}`
                }

                const active = href === pathname

                return (
                  <Link
                    key={index}
                    href={href}
                    className={`text-sm font-medium transition ${active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {i}
                  </Link>
                )
              })
            )}
          </div>
          {/* Button */}
          <div className='flex relative items-center gap-3'>
            <div className='hidden md:block relative'>
              {userData
                ? (
                  <div className='w-11 h-11 rounded-full text-black bg-white text-2xl font-extrabold flex items-center justify-center' onClick={() => setProfileOpen(p => !p)}>
                    {userData.name.charAt(0).toUpperCase()}

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className='absolute top-4 right-0 w-75 font-bold bg-white text-black rounded-2xl shadow-xl border '
                        >
                          <div className='p-5'>
                            <p className='font-semibold text-lg'>{userData.name}</p>
                            <p className='text-gray-500 text-xs mb-4 uppercase'>{userData.role}</p>
                            {userData.role != 'partner' && (
                              <div className='w-full flex items-center gap-3 py-3 hover:bg-gray-200 rounded-lg text-lg font-medium ' onClick={() => router.push("/partner/onboarding/vehicle")}>
                                <div className='flex -space-x-2'>
                                  <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Bike size={16} /></div>
                                  <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Car size={16} /></div>
                                  <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Truck size={16} /></div>
                                </div>
                                Become a partner <ChevronRight size={16} />
                              </div>
                            )}
                            <div className='text-lg flex items-center justify-center gap-3 py-3 hover:bg-gray-200 rounded-xl mt-2 font-medium' onClick={handleLogout}>
                              <LogOut size={16} /> Logout
                            </div>
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div>
                    <button className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-medium cursor-pointer" onClick={() => setAuthOpen(true)}>
                      Login
                    </button>
                  </div>
                )}
            </div>

            <div className='md:hidden relative'>
              {userData
                ? (
                  <div className='w-11 h-11 rounded-full text-black bg-white text-2xl font-extrabold flex items-center justify-center' onClick={() => setProfileOpen(p => !p)}>
                    {userData.name.charAt(0).toUpperCase()}


                  </div>
                ) : (
                  <div>
                    <button className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-medium cursor-pointer" onClick={() => setAuthOpen(true)}>
                      Login
                    </button>
                  </div>
                )}
            </div>

            <button className='md:hidden text-white cursor-pointer' onClick={() => setMenuOpen(p => !p)}>
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div >
      </motion.div >

      {/* muburger for mobile view  */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              onClick={() => setMenuOpen(false)}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black z-30 md:hidden'
            >

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed top-21.25 left-1/2 -translate-x-1/2 w-[92%] bg-[#0B0B0B] rounded-2xl shadow-2xl z-40 md:hidden overflow:hidden  "
              >
              <div className='flex flex-col divide-y divide-white/10'>
  {userData?.role === 'partner' ? (
    <>
      <Link
        href="/"
        className='px-6 py-4 text-white hover:bg-white/10'
      >
        Home
      </Link>

      <Link
        href="/partner/pending-requests"
        className='px-6 py-4 text-white hover:bg-white/10'
      >
        Pending Requests
      </Link>

      <Link
        href="/partner/bookings"
        className='px-6 py-4 text-white hover:bg-white/10'
      >
        Bookings
      </Link>

      <Link
        href="/partner/active-ride"
        className='px-6 py-4 text-white hover:bg-white/10'
      >
        Active Rides
      </Link>
    </>
  ) : (
    Nav_Items.map((i, index) => {
      let href

      if (i === 'Home') {
        href = '/'
      } else {
        href = `/user/${i.toLowerCase().replace(/\s+/g, '-')}`
      }

      return (
        <Link
          key={index}
          href={href}
          className='px-6 py-4 text-gray-300 hover:bg-white/10'
        >
          {i}
        </Link>
      )
    })
  )}
</div>
                
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      

      {/* profile for mobile */}
      <AnimatePresence>
        {profileOpen && userData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              onClick={() => setProfileOpen(false)}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black z-30 md:hidden'
            >
              <motion.div
                initial={{ y: 400 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 25 }}
                exit={{ y: 400 }}
                className='fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden'
              >
                <div className='p-5'>
                  <p className='font-semibold text-lg'>{userData.name}</p>
                  <p className='text-gray-500 text-xs mb-4 uppercase'>{userData.role}</p>
                  {userData.role != 'partner' && (
                    <div className='w-full flex items-center gap-3 py-3 hover:bg-gray-200 rounded-lg text-lg font-medium ' onClick={() => router.push("/partner/onboarding/vehicle")}>
                      <div className='flex -space-x-2'>
                        <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Bike size={16} /></div>
                        <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Car size={16} /></div>
                        <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Truck size={16} /></div>
                      </div>
                      Become a partner <ChevronRight size={16} />
                    </div>
                  )}
                  <div className='text-lg flex items-center justify-center gap-3 py-3 hover:bg-gray-200 rounded-xl mt-2 font-medium' onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModel open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

export default Nav
