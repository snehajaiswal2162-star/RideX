'use client'
import { AnimatePresence, motion } from 'motion/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BarChart2, Star, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'

type Earnings = {
    date: string,
    earnings: number
}

const AdminEarning = () => {

    const [earningData, setEarningData] = useState<Earnings[]>([])

    useEffect(() => {
        const fetchEarning = async () => {
            try {
                const { data } = await axios.get('/api/admin/earning')
                console.log(data)
                const last7DaysData: Earnings[] = data.slice(-7)
                setEarningData(last7DaysData)
            } catch (error: any) {
                console.log(error.response.data.message)
            }
        }
        fetchEarning()
    }, [])

    const total = earningData.reduce((a, d) => a + d.earnings, 0)
    const avg = earningData.length ? Math.round(total / earningData.length) : 0
    const max = earningData.length ? Math.max(...earningData.map((d) => d.earnings)) : 0
    const bestDay = earningData.find((d) => d.earnings === max)
    const today = earningData[earningData.length - 1]
    const yesterday = earningData[earningData.length - 2]
    const delta = today && yesterday ? today.earnings - yesterday.earnings : 0
    const deltaPos = delta >= 0
    const deltaPercentage = yesterday ? Math.abs(Math.round((delta / yesterday.earnings) * 100)) : 0

    const fmt = (n: number) => {
        return '₹' + n.toLocaleString()
    }

    const metrics = [
        {
            label: "Best Day",
            value: fmt(max),
            sub: bestDay?.date ?? "-",
            icon: <Star size={14} />,
            color: "text-violet-600",
            bg: "bg-violet-50",
        },
        {
            label: "Daily Avg",
            value: fmt(avg),
            sub: "per day",
            icon: <BarChart2 size={14} />,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Today",
            value: today ? fmt(today.earnings) : "-",
            sub:
                today && yesterday
                    ? `${deltaPos ? "+" : ""}${fmt(delta)} vs yesterday`
                    : "-",
            icon: <Zap size={14} />,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
    ];
    return (
        <div className='bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 w-full mt-25'>
            <div className='flex items-center justify-between mb-6 flex-wrap gap-4'>
                <div>
                    <span className='inline-block tracking-widest uppercase text-[11px] text-blue-600 bg-blue-50 font-semibold 
            px-3 py-1 rounded-full mb-2'>
                        Admin Dashboard
                    </span>
                    <h2 className='text-xl font-bold text-zinc-900 tracking-tight'>
                        Daily Earning
                    </h2>
                    <p className='text-sm text-zinc-400 mb-1'>
                        Last 7 days performance
                    </p>
                </div>
                <div className='text-right'>
                    <p className='text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-semibold'>
                        Weekly Earing
                    </p>
                    <motion.div
                        key={total}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-3xl font-blod tracking-tight font-mono text-zinc-900'
                    >
                        {fmt(total)}
                    </motion.div>

                    <div className={`flex items-center justify-end gap-1 text-xs font-semibold mt-1
                ${deltaPos ? 'text-emerald-500' : 'text-red-500'}`}>
                        {deltaPos ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{deltaPercentage}% Vs Yesterday</span>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-3 mb-6  gap-3'>
                {metrics.map((m,i)=> (
                    <motion.div
                    key={m.label}
                    initial={{opacity:0, y:12}}
                    animate={{opacity:1, y:0}}
                    transition={{delay: i * 0.07, duration:0.4}}
                    className='bg-zinc-50 rounded-2xl p-4'
                    >
<div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider mb-2 ${m.color}`}>
    <span  className={`${m.color} rounded-lg p-1 ${m.bg}`}>{m.icon}</span>
    {m.label}
</div>
<p className='text-lg font-bold text-zinc-900 font-mono leading-none'>{m.value}</p>
<p className='text-[11px] mt-1 text-zinc-400'>{m.sub}</p>
                    </motion.div>
                ))}
            </div>


            <AnimatePresence>
                <motion.div
                initial={{opacity:0, scale:0.98}}
                animate={{opacity:1, scale:1.02}}
                transition={{duration:0.45, ease:'easeOut'}}
                className='h-56 w-full min-w-0'
                >
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <BarChart
                        data={earningData}
                        barCategoryGap={"30%"}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis 
                            dataKey="date"
                            tick={{fontSize: 11, fill: '#9ca3af', fontWeight:500}} axisLine={false} tickLine={false} />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickFormatter={(v) =>
                                    typeof v === 'number' && v >= 1000
                                        ? `${(v / 1000).toFixed(0)}k`
                                        : `${v}`
                                }
                            />
                            <Bar
                            dataKey="earnings" radius={[8,8,3,3]}
                            >
                                {earningData.map((d,i) => {
                                     const isToday = i === earningData.length-1
                                        const isBest = d.earnings == max && !isToday
                                    return (
                                      <Cell
                                      key={`cell-${i}`}
                                      fill={
                                        isToday 
                                        ? '#10b981'
                                        : isBest
                                        ? '#8b5cfg'
                                        : '#bgdbfe'
                                      }
                                      /> 
                                    )
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default AdminEarning
