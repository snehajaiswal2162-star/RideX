// 'use client'
// import React from 'react'
// import { motion } from 'motion/react'
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
// const Footer = () => {
//   return (
//     <div className='w-full bg-black text-white'>
//       <motion.div
//       initial={{opacity:0, y:40}}
//       whileInView={{opacity:1, y:0}}
//       transition={{duration:0.4, ease:"easeOut"}}
//       viewport={{once: true}}
//       className='max-w-7xl mx-auto px-6 py-16'
//       >
//         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>
//           <div>
//             <h2 className='text-2xl font-bold tracking-tight'>RideX</h2>
//             <p className='mt-4 text-gray-400 text-sm leading-relaxed'>Book any vehicle - anytime, anywhere</p>

// <div className="flex gap-4 mt-6">
//   {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon,i)=>(
//     <motion.a
//     key={i}
//     whileHover={{y:-0.3}}
//     href="#"
//     className="h-10 w-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
//     >
// <Icon size={18} />
//     </motion.a>
//   ))}
// </div>

//           </div>
//         </div>

// <div className="border-t border-white/10">
// <div className="max-w-7xl mx-auto p-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-4">
//   <p>@ {new Date().getFullYear()} RideX. All right reserved</p>
// </div>
// </div>

//       </motion.div>
//     </div>
//   )
// }

// export default Footer

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white">
      {/* Main Footer */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              RideX
            </h2>

            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Book any vehicle anytime, anywhere. Fast, reliable and
              affordable transportation solutions for every journey.
            </p>

            <div className="flex gap-4 mt-6">
              {[
                FaFacebook,
                FaTwitter,
                FaInstagram,
                FaLinkedin,
              ].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors duration-300"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/user/booking"
                  className="hover:text-white transition-colors duration-300"
                >
                  Booking
                </Link>
              </li>

              <li>
                <Link
                  href="/user/about-us"
                  className="hover:text-white transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/user/contact-us"
                  className="hover:text-white transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicles */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Vehicles
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <span className="hover:text-white transition-colors duration-300 cursor-pointer">
                  Bike
                </span>
              </li>

              <li>
                <span className="hover:text-white transition-colors duration-300 cursor-pointer">
                  Car
                </span>
              </li>

              <li>
                <span className="hover:text-white transition-colors duration-300 cursor-pointer">
                  Truck
                </span>
              </li>

              <li>
                <span className="hover:text-white transition-colors duration-300 cursor-pointer">
                  Vans
                </span>
              </li>

              <li>
                <span className="hover:text-white transition-colors duration-300 cursor-pointer">
                  SUVs
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Contact Us
            </h3>

            <div className="space-y-3 text-gray-400 text-sm">
              <p>📍 Mumbai, Maharashtra, India</p>
              <p>📞 +91 98765 43210</p>
              <p>✉ support@ridex.com</p>
              <p>🕒 24/7 Customer Support</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 flex justify-center" >
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} RideX. All rights
            reserved.
          </p>

          {/* <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="hover:text-white transition-colors duration-300"
            >
              Terms & Conditions
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer