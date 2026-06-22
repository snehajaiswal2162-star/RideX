'use client'
import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Bike, Car, Truck, Bus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from 'next/navigation' 

const HeroSection = ({onAuthRequired}:{onAuthRequired:()=>void}) => {

  const {userData} = useSelector((state:RootState) => state.user)
  const router = useRouter()


  return (
    <div className="relative min-h-screen overflow-hidden w-full">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/heroImage.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white font-extrabold text-4xl sm:text-5xl md:text-7xl"
        >
          Book Any Vehicle
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-xl mt-5 text-gray-400"
        >
          From daily ride to heavy transport - all in one platform
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex gap-8 text-gray-400"
        >
          <Bike size={30} />
          <Car size={30} />
          <Truck size={30} />
          <Bus size={30} />
        </motion.div>
        <motion.button
        whileHover={{scale:1.07}}
        whileTap={{scale:0.90}}
        className=' bg-white text-black font-semibold rounded-full shadow-xl mt-6 px-6 py-3 cursor-pointer' onClick={() =>{userData ? router.push('/user/book') : onAuthRequired()}}
        >
            Book Now
        </motion.button>
      </div>
    </div>
  );
};

export default HeroSection;
