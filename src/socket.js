import { randomUUID } from 'node:crypto'
// eslint-disable-next-line import-x/no-named-as-default
import WebSocket from 'ws'
import packageInfo from '../package.json' with { type: 'json' }

const appName = packageInfo.name
const appVersion = packageInfo.version
const optionalClientGUID = 'f5d10cb7-261d-48c2-a0db-1c9791990a34'

const createRequest = (parameters, message) => {
  return {
    requestId: randomUUID(),
    object: null,
    params: parameters,
    message,
  }
}

const createSocket = (url) => {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  const listeners = new Map()

  const addListener = (requestId, resolve, reject, timeout = 5000) => {
    listeners.set(requestId, { resolve, reject })

    setTimeout(() => {
      if (listeners.has(requestId)) {
        const error = new Error('Timeout waiting for answer')
        listeners.get(requestId).reject(error)
        removeListener(requestId)
      }
    }, timeout)
  }

  const removeListener = (requestId) => {
    listeners.delete(requestId)
  }

  const send = (parameters, message, timeout) => {
    const request = createRequest(parameters, message)
    const { requestId } = request

    return new Promise((resolve, reject) => {
      addListener(requestId, resolve, reject, timeout)

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
    const answer = await send([appName, appVersion, optionalClientGUID], 'register', 60000)

    if (answer.success) {
      resolve(instance)
    } else {
      reject(new Error('Failed to pair with Lightroom', { cause: answer }))
    }
  })

  ws.on('message', (data) => {
    const answer = JSON.parse(data)
    const { requestId, message } = answer

    if (message === 'close') {
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
    throw new Error('Lightroom connection closed')
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
