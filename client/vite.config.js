import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {  //now jst whichile fetching jst do all only api 
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:4000",
  //       changeOrigin: true
  //     }
  //   }
  // }
})
