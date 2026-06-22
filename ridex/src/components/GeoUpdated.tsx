'use client'
import { getSocket } from '@/lib/socket'
import React, { useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'

const GeoUpdated = ({ userId }: { userId: String }) => {
    const socketRef = useRef<Socket>(null)

    useEffect(() => {
        if (!userId) return
        if (!navigator.geolocation) return

        socketRef.current = getSocket()
        socketRef.current.emit("identity", userId)

        const watcher = navigator.geolocation.watchPosition(({ coords }) => {
            socketRef.current?.emit("update-location", {
                userId,
                latitude: coords.latitude,
                longitude: coords.longitude
            })
        }, (err) => {
            console.log(err)
        }, {
            enableHighAccuracy: true,
            maximumAge: 5000
        })
        return () => { navigator.geolocation.clearWatch(watcher) }
    }, [userId])
    return (
        <div>

        </div>
    )
}

export default GeoUpdated

