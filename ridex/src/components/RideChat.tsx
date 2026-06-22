'use client'
import { getSocket } from '@/lib/socket'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { Send, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

type message = {
  bookingId: string,
  sender: 'User' | 'Driver'
  text: string
  createdAt: Date
}

const RideChat = ({ currentRole, bookingId, userName, driverName }: any) => {
  const myName = currentRole === "User" ? userName : driverName
  const otherName = currentRole === "Driver" ? driverName : userName

  const [messages, setMessages] = useState<message[]>([])
  const [lastMessage, setLastMessage] = useState("")
  const [text, setText] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showAI, setShowAI] = useState(false)
  const [aiLoading, setAiLoading] = useState(true)
  const messageEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    messageEndRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages])

  const sendMsg = async () => {
    const socket = getSocket()
    try {
      const { data } = await axios.post('/api/chat/send', {
        sender: currentRole,
        text,
        bookingId
      })
        
      console.log(data)
      socket.emit('chat message',data)
    } catch (error:any) {
      console.log(error.response.data.message)
    }
  }



  const getAllMsg = async () => {
    try {
      const { data } = await axios.post('/api/chat/get-all', {
        bookingId
      })
      console.log(data)
      setMessages(data)
      setLastMessage(data?.[0]?.text || '')
    } catch (error: any) {
      console.log(error.response.data.message)
    }
  }

  useEffect(() => {
    getAllMsg()
  }, [])


useEffect(()=>{
  const socket = getSocket()
  socket.on('chat message',(data)=>{
    setMessages(prev=>[...prev,data])
  })
  return () => {socket.off('chat message')}
},[])

  const getAiSuggestions = async () => {
  setAiLoading(true)
  setShowAI(true)

  try {
    const { data } = await axios.post('/api/chat/ai-suggestion', {
      role: currentRole,
      lastMessage
    })

    console.log(data)

    // ✅ FIX: directly use array
    setSuggestions(data.suggestions || [])

    setAiLoading(false)
  } catch (error) {
    console.log(error)
    setAiLoading(false)
  }
}

  const formatTime = (dateInput: Date | string) => {
    const date = new Date(dateInput)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className='flex flex-col h-full min-h-0 bg-white rounded-2xl overflow-hidden border border-zinc-200 ' >
      <div className='shrink-0 flex items-center py-3 px-4 gap-3 border border-zinc-300 bg-white'>
        <div className='relative shrink-0'>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-950 text-white
          text-xs font-bold">
            {otherName.charAt(0).toUpperCase()}
          </div>
          <span className='absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full bg-emerald-400' />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='text-sm font-bold text-zinc-900 leading-none'>{otherName}</div>
          <div className='text-[11px] font-semibold text-emerald-400 mt-0.5'>Active Now</div>
        </div>
      </div>

      <div
        className='flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-50'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`div::-webkit-scrollbar {display:none;} `}</style>

        {messages.length === 0 && (
          <div className='flex flex-col items-center justify-center h-full gap-3 py-16'>
            <div className='w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-100'>
              <Send className='text-zinc-400' size={18} />
            </div>
            <p className='text-sm text-zinc-400 font-medium'>No messages yet.</p>
            <p className='text-xs text-zinc-300'>Start the conservation below</p>
          </div>
        )}

        {messages.length > 0 && (
          messages.map((m, i) => {
            const isMine = m.sender === currentRole
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 9, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1.03 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[72%] px-3.5 py-2.5 leading-none rounded-2xl text-sm shadow-md
          ${isMine ? 'rounded-br-sm bg-zinc-950 text-white' : 'bg-white border border-zinc-200 text-zinc-950 rounded-bl-sm'}`}>
                  <p className='break-words'>{m.text}</p>
                  <span className='text-[7px] text-zinc-300'>{formatTime(m.createdAt)}</span>
                </div>
              </motion.div>
            )
          })
        )}
        <div ref={messageEndRef} />
      </div>

      

      <AnimatePresence>
        {showAI && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='shrink-0 overflow-hidden border-t border-zinc-200 bg-white'
          >
            <div className='px-4 pt-3 pb-2'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-1.5'>
                  <Sparkles size={12} className='text-violet-400' />
                  <span className='text-[11px] font-semibold text-zinc-400 uppercase tracking-wider'>AI Suggesstions</span>
                </div>
                <button onClick={() => setShowAI(false)}><X className='text-zinc-400 hover:text-zinc-600 cursor-pointer' size={14} /></button>
              </div>

              {aiLoading ? (
                <div className='flex flex-col gap-1.5'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className='h-9 bg-zinc-200 animate-pulse rounded-xl'></div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col gap-1.5'>
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setText(s), setShowAI(false) }}
                      className='text-left text-sm rounded-lg text-zinc-700 bg-zinc-50 hover:bg-violet-100 
    hover:text-violet-700 border hover:border-violet-300 border-zinc-300'
                    >{s}</motion.div>
                  ))}
                  <button 
                  onClick={getAiSuggestions}
                  className='text-[10px]  text-violet-500 hover:text-violet-700 font-semibold cursor-pointer 
                  text-center mt-1 transition-colors'>
                    Refresh Suggestions
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className='shrink-0 px-4 pb-4 pt-2 bg-white'>
        <div className="flex items-center gap-2 bg-zinc-100 rounded-2xl pl-3 pr-1.5 py-1.5">
          {messages.length > 0 && (
            <motion.div
            whileTap={{ scale:0.9 }}
            onClick={getAiSuggestions}
            className={` shrink-0  w-8 h-8 rounded-xl flex items-center justify-center transition-all *
              ${showAI ? 'bg-violet-600 text-white' : 'bg-white text-violet-500 hover:text-violet-600 border border-zinc-200'}`}
            >
              <Sparkles size={15} />
            </motion.div>
          )}

          <input 
          type='text'
          value={text}
          placeholder='Message...'
          onChange={(e)=>setText(e.target.value)}
          className='flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none
           py-1.5 min-w-0'
          />
          <motion.button
          whileTap={{scale:0.98}}
          onClick={()=>  { console.log("SEND CLICKED")
 sendMsg()}}
          disabled={!text.trim()}
          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all
            ${text.trim() ? 'bg-zinc-950 hover:bg-zinc-800 text-white' : 'bg-transparent text-zinc-300 cursor-not-allowed'}`}
          >
            <Send size={15} />
          </motion.button>
        </div>
      </div>
    </div>


  )
}

export default RideChat
