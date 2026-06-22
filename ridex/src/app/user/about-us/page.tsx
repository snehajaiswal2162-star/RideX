'use client'

import { motion } from 'motion/react'
import {
  ShieldCheck,
  MapPinned,
  Clock3,
  IndianRupee,
  Users,
  Car
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const features = [
  {
    icon: Clock3,
    title: 'Fast Booking',
    description: 'Book your ride within seconds with our seamless platform.'
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Secure',
    description: 'Verified drivers and secure ride experience every time.'
  },
  {
    icon: MapPinned,
    title: 'Live Tracking',
    description: 'Track your vehicle in real-time from pickup to destination.'
  },
  {
    icon: IndianRupee,
    title: 'Affordable Pricing',
    description: 'Transparent pricing with no hidden charges.'
  }
]

const stats = [
  { value: '10K+', label: 'Rides Completed' },
  { value: '2K+', label: 'Happy Customers' },
  { value: '500+', label: 'Verified Drivers' },
  { value: '24/7', label: 'Customer Support' }
]

export default function AboutUs() {
        const router = useRouter()
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
            About RideX
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-gray-400 text-lg">
            RideX is transforming transportation by making vehicle
            booking fast, reliable, affordable, and accessible
            for everyone.
          </p>
        </motion.div>

        {/* Story */}
        <section className="mt-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="text-4xl font-bold mb-6">
                Our Story
              </h2>

              <p className="text-gray-400 leading-8">
                RideX was built with a vision to simplify transportation
                for individuals and businesses. Whether you need a bike
                for quick travel, a car for comfortable journeys, a van
                for group travel, or a truck for deliveries, RideX makes
                booking effortless.
              </p>

              <p className="text-gray-400 leading-8 mt-6">
                Our platform connects customers with trusted drivers
                while providing real-time tracking, transparent pricing,
                and exceptional support.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
              <Car size={80} />
              <h3 className="text-2xl font-semibold mt-6">
                One Platform. Every Vehicle.
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                From bikes and cars to SUVs, vans, and trucks,
                RideX gives you access to transportation solutions
                tailored to your needs.
              </p>
            </div>

          </div>
        </section>

        {/* Mission */}
        <section className="mt-28 text-center">
          <h2 className="text-4xl font-bold">
            Our Mission
          </h2>

          <p className="max-w-4xl mx-auto mt-6 text-gray-400 leading-8">
            To revolutionize transportation through technology,
            delivering safe, efficient, and affordable mobility
            solutions that empower people and businesses.
          </p>
        </section>

        {/* Stats */}
        <section className="mt-28">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            {stats.map((item) => (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
              >
                <h3 className="text-4xl font-bold">
                  {item.value}
                </h3>

                <p className="text-gray-400 mt-3">
                  {item.label}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mt-28 mb-20">
          <h2 className="text-4xl font-bold text-center mb-14">
            Why Choose RideX
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <motion.div
                  whileHover={{ y: -6 }}
                  key={feature.title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                  <Icon size={40} />

                  <h3 className="text-xl font-semibold mt-5">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 mt-3 leading-7">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}

          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="bg-white text-black rounded-3xl p-12 text-center">
            <Users size={50} className="mx-auto mb-4" />

            <h2 className="text-3xl font-bold">
              Ready to Ride?
            </h2>

            <p className="mt-4 text-gray-700">
              Join thousands of customers who trust RideX
              for their transportation needs.
            </p>

            <button className="mt-8 px-8 py-3 rounded-full bg-black text-white font-semibold cursor-pointer"
            onClick={() => router.push('/user/book')}
            >
              Book a Ride
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}