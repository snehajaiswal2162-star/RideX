'use client'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { SessionProvider } from 'next-auth/react'

const ReduxProvider = ({children}:{children:ReactNode}) => {
  return (
    <SessionProvider>
    <Provider store={store}>
    {children}
    </Provider>
    </SessionProvider>
    
  )
}

export default ReduxProvider
