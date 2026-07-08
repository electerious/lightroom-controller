import createHttpServer from '../src/server.js'
import createSocket from '../src/socket.js'
import { loadEnv } from './utils/load-env.js'

export const run = async (options = {}, overrides = {}) => {
  loadEnv(options.config)

  const wsUrl = process.env.LIGHTROOM_WS_URL || 'ws://127.0.0.1:7682'
  const port = process.env.PORT || 3000

  const socket = await (overrides.createSocket || createSocket)(wsUrl)
  console.log(`Successfully paired with Lightroom at '${wsUrl}'`)

  await (overrides.createHttpServer || createHttpServer)(port)(socket)
  console.log(`Server is running at 'http://localhost:${port}'`)
}
