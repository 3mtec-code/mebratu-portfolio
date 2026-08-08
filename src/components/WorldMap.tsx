'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

interface WorldMapProps {
    location?: string
    lat?: number   // latitude  (Gondar ≈ 12.6)
    lng?: number   // longitude (Gondar ≈ 37.5)
}

export default function WorldMap({ location = 'Gondar, Ethiopia', lat = 12.6, lng = 37.5 }: WorldMapProps) {
    // Convert lat/lng to % on equirectangular map
    // lng: -180→180  maps to 0→100%
    // lat:  90→-90   maps to 0→100%
    const pinLeft = ((lng + 180) / 360) * 100        // ≈ 60.4%
    const pinTop = ((90 - lat) / 180) * 100        // ≈ 43.0%

    return (
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#0f1729] border border-gray-800"
            style={{ aspectRatio: '16/7' }}>

            {/* Real world map SVG from Natural Earth / open source */}
            {/* Using a reliable CDN-hosted world map image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png"
                alt="World Map"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                onError={(e) => {
                    // Fallback: draw a simple grid if image fails
                    (e.target as HTMLImageElement).style.display = 'none'
                }}
            />

            {/* Grid overlay for depth */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 50">
                {[10, 20, 30, 40].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#6366f1" strokeWidth="0.3" />)}
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(x => <line key={x} x1={x} y1="0" x2={x} y2="50" stroke="#6366f1" strokeWidth="0.3" />)}
            </svg>

            {/* Location pin — positioned by lat/lng */}
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
                className="absolute z-20"
                style={{
                    left: `${pinLeft}%`,
                    top: `${pinTop}%`,
                    transform: 'translate(-50%, -100%)',
                }}
            >
                {/* Pulse rings */}
                <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full bg-indigo-500/20 animate-ping absolute" />
                    <span className="w-6 h-6 rounded-full bg-indigo-500/30 animate-ping absolute" style={{ animationDelay: '0.3s' }} />
                </span>
                {/* Pin */}
                <div className="relative flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white shadow-lg shadow-indigo-900/60 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div className="w-0.5 h-3 bg-indigo-500" />
                    <div className="w-2 h-1 bg-indigo-600/50 rounded-full" />
                </div>
            </motion.div>

            {/* Location badge — bottom right */}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10"
            >
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <div>
                        <p className="text-white text-xs font-semibold leading-tight">{location}</p>
                        <p className="text-gray-300 text-[10px] leading-tight">Available worldwide 🌍</p>
                    </div>
                </div>
            </motion.div>

            {/* Coordinates */}
            <div className="absolute top-3 right-3 text-[10px] text-indigo-400/70 font-mono z-10">
                {lat.toFixed(1)}°N {lng.toFixed(1)}°E
            </div>
        </div>
    )
}
