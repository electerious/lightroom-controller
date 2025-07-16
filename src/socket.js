import { randomUUID } from 'crypto'
import WebSocket from 'ws'
import packageInfo from '../package.json' with { type: 'json' }

const appName = packageInfo.name
const appVersion = packageInfo.version
const optionalClientGUID = 'f5d10cb7-261d-48c2-a0db-1c9791990a34'

const createSocket = (url) => {
  const { promise, resolve, reject } = Promise.withResolvers()

  let listeners = new Map()

  const createRequest = (params, message) => {
    return {
      requestId: randomUUID(),
      object: null,
      params,
      message,
    }
  }

  const addListener = (requestId, resolve, reject) => {
    listeners.set(requestId, { resolve, reject })

    setTimeout(() => {
      if (listeners.has(requestId)) {
        const error = new Error('Timeout waiting for answer')
        listeners.get(requestId).reject(error)
        removeListener(requestId)
      }
    }, 5000)
  }

  const removeListener = (requestId) => {
    listeners.delete(requestId)
  }

  const send = (params, message) => {
    const request = createRequest(params, message)
    const { requestId } = request

    return new Promise((resolve, reject) => {
      addListener(requestId, resolve, reject)

      ws.send(JSON.stringify(request), (error) => {
        if (error) {
          removeListener(requestId)
          reject(error)
        }
      })
    })
  }

  const ws = new WebSocket(url)

  ws.on('open', async () => {
    const answer = await send([appName, appVersion, optionalClientGUID], 'register')

    if (answer.success) {
      resolve(instance)
    } else {
      reject(new Error('Failed to pair with Lightroom', { cause: answer }))
    }
  })

  ws.on('message', (data) => {
    const answer = JSON.parse(data)
    const { requestId } = answer

    if (answer.message === 'close') {
      ws.close()

      return
    }

    if (listeners.has(requestId)) {
      listeners.get(requestId).resolve(answer)
      listeners.delete(requestId)

      return
    }
  })

  ws.on('close', () => {
    console.log('Connection closed by Lightroom')
    process.exit(0)
  })

  ws.on('error', (error) => {
    throw new Error('Failed to connect to Lightroom', { cause: error })
  })

  const instance = {
    send,
  }

  return promise
}

export default createSocket
