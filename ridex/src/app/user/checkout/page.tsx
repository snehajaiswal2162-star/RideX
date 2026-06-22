import CheckoutComponents from '@/components/CheckoutComponent'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutComponents />
    </Suspense>
  )
}

export default page
