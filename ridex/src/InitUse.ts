'use client'
import { useSession } from 'next-auth/react'
import useGetMe from './hooks/useGetMe'

const InitUse = () => {
  const {status} = useSession()
  useGetMe(status==='authenticated')
  return null
}

export default InitUse
