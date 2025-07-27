import { createServer } from 'http'
import { URL } from 'url'

const ok = (response, data) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ status: 'ok', data }))
}

const notFound = (response) => {
  response.writeHead(404, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ status: 'not found' }))
}

const unavailable = (response, error) => {
  response.writeHead(503, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ status: 'service unavailable', data: error }))
}

const internalServerError = (response, error) => {
  response.writeHead(500, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ status: 'internal server error', data: error }))
}

const createHttpServer = (port) => (socket) => {
  const { promise, resolve, reject } = Promise.withResolvers()

  const server = createServer(async (request, response) => {
    try {
      const parsedUrl = new URL(request.url, `http://localhost:${port}`)
      
      // Parse URL with regex pattern '/parameter/message'
      const urlMatch = parsedUrl.pathname.match(/^\/([^\/]+)\/([^\/]+)$/)
      if (!urlMatch) return notFound(response)

      const parameter = urlMatch[1]
      const message = urlMatch[2]

      // Handle amount parameter for increment/decrement operations
      let params = [parameter]
      if (message === 'increment' || message === 'decrement') {
        const amount = parsedUrl.searchParams.get('amount')
        if (amount !== null) {
          const amountValue = parseFloat(amount)
          if (!isNaN(amountValue)) {
            params = [parameter, amountValue]
          }
        }
      }

      const answer = await socket.send(params, message)
      if (!answer.success) {
        return internalServerError(response, answer)
      }

      return ok(response, answer)
    } catch (error) {
      return internalServerError(response, error)
    }
  })

  server.on('listening', () => {
    resolve(server)
  })

  server.on('error', (error) => {
    reject(error)
  })

  server.listen(port)

  return promise
}

export default createHttpServer
