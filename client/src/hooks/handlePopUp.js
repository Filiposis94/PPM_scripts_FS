import { useCallback, useEffect, useRef, useState } from "react"

export function usePopup() {
	const [popup, setPopup] = useState({
		msg: "",
		isShown: false
	})

	const timerRef = useRef(null)

	const showPopup = useCallback((message) => {
		setPopup({
			msg: message,
			isShown: true
		})

		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}

		timerRef.current = window.setTimeout(() => {
			setPopup({
				msg: "",
				isShown: false
			})
		}, 5000)
	}, [])

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
		}
	}, [])

	return { popup, showPopup }
}
