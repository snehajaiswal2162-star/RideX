'use client'

import { motion } from 'motion/react'
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  MessageCircle,
  Send
} from 'lucide-react'

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-black text-white pt-32">
      <div className="max-w-7xl mx-auto px-6">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold">
            Contact Us
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-gray-400 text-lg">
            Have questions, feedback, or need assistance?
            Our team is here to help 24/7.
          </p>
        </motion.div>

        {/* Main Section */}
        <div className="grid lg:grid-cols-2 gap-12 mt-20">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle size={28} />
              <h2 className="text-2xl font-bold">
                Send a Message
              </h2>
            </div>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-white/40"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-white/40"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-white/40"
              />

              <textarea
                rows={6}
                placeholder="Write your message..."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none resize-none focus:border-white/40"
              />

              <button
                type="submit"
                className="w-full bg-white text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition cursor-pointer"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <Phone size={26} />
                <div>
                  <h3 className="font-semibold text-lg">
                    Phone
                  </h3>
                  <p className="text-gray-400">
                    +91 98765 43210
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <Mail size={26} />
                <div>
                  <h3 className="font-semibold text-lg">
                    Email
                  </h3>
                  <p className="text-gray-400">
                    support@ridex.com
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <MapPin size={26} />
                <div>
                  <h3 className="font-semibold text-lg">
                    Address
                  </h3>
                  <p className="text-gray-400">
                    Mumbai, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <Clock3 size={26} />
                <div>
                  <h3 className="font-semibold text-lg">
                    Support Hours
                  </h3>
                  <p className="text-gray-400">
                    24 Hours / 7 Days a Week
                  </p>
                </div>
              </div>
            </div>

            {/* Support Banner */}
            <div className="bg-white text-black rounded-3xl p-8 mt-4">
              <h3 className="text-2xl font-bold">
                Need Immediate Help?
              </h3>

              <p className="mt-3 text-gray-700">
                Our support team is available around the clock
                to assist you with bookings, payments, tracking,
                and partner-related queries.
              </p>

              <button className="mt-6 px-6 py-3 rounded-full bg-black text-white font-semibold cursor-pointer">
                Contact Support
              </button>
            </div>

          </motion.div>
        </div>

        {/* FAQ Section */}
        <section className="mt-24 pb-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'How do I book a ride?',
                a: 'Simply select your pickup and drop location, choose a vehicle, and confirm your booking.'
              },
              {
                q: 'Can I track my ride?',
                a: 'Yes, RideX provides real-time vehicle tracking after booking confirmation.'
              },
              {
                q: 'Do you offer truck bookings?',
                a: 'Yes, RideX supports bike, car, SUV, van, and truck bookings.'
              },
              {
                q: 'How can I become a partner?',
                a: 'Register as a partner through our onboarding process and submit vehicle details.'
              }
            ].map((item) => (
              <div
                key={item.q}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <h3 className="font-semibold text-lg">
                  {item.q}
                </h3>

                <p className="text-gray-400 mt-3">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}