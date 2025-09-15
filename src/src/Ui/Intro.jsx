import { Canvas } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Model } from '../Objects/HelperObjects/Model.jsx'

export function Intro({ children }) {
	const [showChildren, setShowChildren] = useState(false)
	const [isFadingOut, setIsFadingOut] = useState(false)
	const [hidden, setHidden] = useState(false)
	const startedRef = useRef(false)

	const start = useCallback(() => {
		if (startedRef.current) return
		startedRef.current = true
		setShowChildren(true)
		requestAnimationFrame(() => setIsFadingOut(true))
		const timeout = setTimeout(() => setHidden(true), 650)
		return () => clearTimeout(timeout)
	}, [])

	useEffect(() => {
		const onKey = (e) => {
			if (e.code === 'Enter' || e.code === 'Space') {
				e.preventDefault()
				start()
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [start])

	return (
		<>
			{showChildren && children}

			{!hidden && (
				   <div className={`p-5 flex flex-row items-center justify-center h-screen bg-black text-white ${isFadingOut ? 'fade-out' : ''}`}>
					   <div className=" flex-1 flex flex-col gap-5 items-center justify-center text-center self-center mb-100">
						   <h1 className="text-5xl mt-2 mb-8 w-full text-center">Drive Thru</h1>
						   {/* <p>Press Enter, Space or click to start</p> */}
						   <button className="border-solid text-white bg-red-500 px-20 py-4 text-2xl rounded-full hover:bg-red-600 transition-all duration-200" onClick={start} aria-label="Start">
							   Start
						   </button>
					   </div>
					   <div className="flex-1 flex items-center justify-center">
						   <Canvas className="w-full h-full rounded-lg" shadows camera={{ position: [5, 2, -5], fov: 70}} style={{height: '70vh', width: '100%'}}>
							   <ambientLight intensity={0.5} />
							   <directionalLight position={[5, 30, 5]} castShadow/>
							   <Model name={"truck01"} type={"car"} scale={[6,6,6]}/>
						   </Canvas>
					   </div>
				   </div>
			)}
		</>
	)
}

