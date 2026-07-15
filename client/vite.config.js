import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [react()],
	oxc: {
		include: /src\/.*\.js$/
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:4000",
				changeOrigin: true
			},
			"/socket.io": {
				target: "http://localhost:4000",
				ws: true,
				changeOrigin: true
			}
		}
	}
})
