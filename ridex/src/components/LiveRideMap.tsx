import L from 'leaflet'
import { MapPin, Navigation2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import axios from 'axios'

type props = {
  driverLocation: [number, number]
  pickupLocation: [number, number]
  dropLocation: [number, number]
  mapStatus: string,
  onStats: (data:{
    distanceToPickup:number,etaToPickup:number,distanceToDrop:number,etaToDrop:number
  })=>void
}

const pickupIcon = new L.DivIcon({
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.28))">
      <div style="
        background:#0a0a0a;
        color:#fff;
        padding:5px 13px;
        border-radius:100px;
        font-size:10px;
        font-weight:800;
        letter-spacing:0.1em;
        text-transform:uppercase;
        white-space:nowrap;
        font-family:system-ui">
        PICKUP
      </div>
      <div style="width:2px; height:9px; background:#0a0a0a"></div>
      <div style="
        width:10px;
        height:10px;
        background:#0a0a0a;
        border-radius:50%;
        border:2.5px solid #fff;
        box-shadow:0 2px 6px rgba(0,0,0,0.3)">
      </div>
    </div>
  `,
  className: "",
  iconSize: [80, 50],
  iconAnchor: [40, 50]
});

const dropIcon = new L.DivIcon({
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.28))">
      <div style="
        background:#0a0a0a;
        color:#fff;
        padding:5px 13px;
        border-radius:100px;
        font-size:10px;
        font-weight:800;
        letter-spacing:0.1em;
        text-transform:uppercase;
        white-space:nowrap;
        font-family:system-ui">
        DROP
      </div>
      <div style="width:2px; height:9px; background:#0a0a0a"></div>
      <div style="
        width:10px;
        height:10px;
        background:#0a0a0a;
        border-radius:50%;
        border:2.5px solid #fff;
        box-shadow:0 2px 6px rgba(0,0,0,0.3)">
      </div>
    </div>
  `,
  className: "",
  iconSize: [70, 50],
  iconAnchor: [35, 50]
});

const driverIcon = new L.DivIcon({
  html: `
    <div id="car-marker" style="
      width:52px;
      height:52px;
      display:flex;
      align-items:center;
      justify-content:center;
      transform-origin:center;
      transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      filter:drop-shadow(0 6px 18px rgba(0,0,0,0.5));
    ">
      <div style="
        background:#0a0a0a;
        width:46px;
        height:46px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 0 0 3px #fff,0 0 0 5px #0a0a0a,0 8px 28px rgba(0,0,0,0.5);
      ">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 11L6.5 6.5H17.5L19 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="3" y="11" width="18" height="7" rx="2" stroke="white" strokeWidth="1.6" />
          <circle cx="7.5" cy="18.5" r="1.5" fill="white" />
          <circle cx="16.5" cy="18.5" r="1.5" fill="white" />
          <path d="M3 14H21" stroke="white" strokeWidth="1" opacity="0.35" />
        </svg>
      </div>
    </div>
  `,
  className: "",
  iconSize: [70, 50],
  iconAnchor: [35, 50],
});

const LiveRideMap = ({ driverLocation, pickupLocation, dropLocation, mapStatus, onStats }: props) => {
  const [routeToPickup, setRouteToPickup] = useState<[number, number][]>([])
  const [routeToDrop, setRouteToDrop] = useState<[number, number][]>([])

  useEffect(() => {
    // Safety check: Prevent execution if variables are uninitialized or default [0, 0] values
    const isDriverValid = driverLocation && (driverLocation[0] !== 0 || driverLocation[1] !== 0);
    const isPickupValid = pickupLocation && (pickupLocation[0] !== 0 || pickupLocation[1] !== 0);
    const isDropValid = dropLocation && (dropLocation[0] !== 0 || dropLocation[1] !== 0);

    if (!isDriverValid || !isPickupValid || !isDropValid) {
      console.log("Skipping OSRM API call: Coordinates are still loading...");
      return;
    }

    const [pLat, pLon] = pickupLocation;
    const [dLat, dLon] = dropLocation;
    const [drLat, drLon] = driverLocation;


    const getRoute = async (startLat: number, startLon: number, endLat: number, endLon: number) => {
      // OSRM expects longitude first, then latitude
      const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`)
      return res.data.routes?.[0]
    }

    const fetchRoute = async () => {
      try {
        if (mapStatus === 'arriving') {
          // Route 1: Driver to Pickup Location
          const pickupRoute = await getRoute(drLat, drLon, pLat, pLon)
          // Route 2: Pickup Location to Drop Location
          const dropRoute = await getRoute(pLat, pLon, dLat, dLon)

          if (pickupRoute) {
            // OSRM coordinates are [lon, lat], we must flip them to [lat, lon] for Leaflet
            setRouteToPickup(pickupRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
          }
          if (dropRoute) {
            setRouteToDrop(dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
          }

          onStats?.({
            distanceToPickup:(pickupRoute.distance ?? 0)/1000,
            etaToPickup:(pickupRoute.duration ?? 0)/60,
            distanceToDrop:(dropRoute.distance ?? 0)/1000,
            etaToDrop:(dropRoute.duration ?? 0)/60,
          })
        } else {
          setRouteToPickup([])

          // Route 2: Driver to Drop Location (once ride is started / in-progress)
          const dropRoute = await getRoute(drLat, drLon, dLat, dLon)
          if (dropRoute) {
            setRouteToDrop(dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
          }

          onStats?.({
            distanceToPickup:0,
            etaToPickup:0,
            distanceToDrop:(dropRoute.distance ?? 0)/1000,
            etaToDrop:(dropRoute.duration ?? 0)/60,
          })
        }
      } catch (error) {
        console.error("Error fetching map route lines: ", error)
      }
    }

    fetchRoute()
  }, [driverLocation, pickupLocation, dropLocation, mapStatus]) // Track all related dependency triggers

  const showPickupMarker = mapStatus === 'arriving'
  const showPickupRoute = mapStatus === 'arriving' && !!routeToPickup?.length
  const showDropRoute = mapStatus !== 'completed' && !!routeToDrop?.length

  return (
    <div className='w-full h-screen bg-zinc-100 relative'>
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={pickupLocation}
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        
        {showPickupMarker && pickupLocation && (
          <Marker position={pickupLocation} icon={pickupIcon} />
        )}

        {dropLocation && (
          <Marker position={dropLocation} icon={dropIcon} />
        )}

        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon} />
        )}

        {showPickupRoute && (
          <Polyline positions={routeToPickup} pathOptions={{ color: '#0a0a0a', weight: 4, lineCap: 'round', lineJoin: 'round' }} />
        )}

        {showDropRoute && (
          <Polyline positions={routeToDrop} pathOptions={{ color: '#888', weight: 4, lineCap: 'round', dashArray: '2 10' }} />
        )}
      </MapContainer>
    </div>
  )
}

export default LiveRideMap