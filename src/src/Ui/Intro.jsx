import { useCallback, useEffect, useRef, useState } from 'react'

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
				<div className={`text-center ${isFadingOut ? 'fade-out' : ''}`}>
					<div className="p-5 flex flex-col gap-5 items-center justify-center h-screen bg-black text-white">
						<h1 className="text-5xl">Drive Thru</h1>
						<p className="">Press Enter, Space or click to start</p>

						<button className="border-solid text-white bg-red-500 px-5 rounded-full" onClick={start} aria-label="Start">
							Start
						</button>

						<div className="">
							<p>Controls:</p>
							<ul>
								<li>Move: W / S or Arrow Keys</li>
								<li>Steer: A / D or Arrow Keys</li>
								<li>Enter or Space: Start</li>
							</ul>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

