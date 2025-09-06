import getPort from 'get-port'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import createHttpServer from '../src/server.js'

test('createHttpServer creates a server and returns a promise', async () => {
  const mockSocket = {
    send: () => ({ success: true, data: 'test-response' }),
  }

  const port = await getPort() // Use get-port to find available port
  const server = await createHttpServer(port)(mockSocket)

  assert.ok(server, 'Server should be created')
  assert.equal(typeof server.listen, 'function', 'Server should have listen method')
  assert.equal(typeof server.close, 'function', 'Server should have close method')

  // Clean up
  server.close()
})

test('server handles valid URL pattern /parameter/message', async () => {
  const mockSocket = {
    send: (parameters, message) => Promise.resolve({ success: true, data: { parameters, message } }),
  }

  const port = await getPort()
  const server = await createHttpServer(port)(mockSocket)
  const address = server.address()

  // Make a request to the server
  const response = await fetch(`http://localhost:${address.port}/exposure/increment`)
  const data = await response.json()

  assert.equal(response.status, 200)
  assert.equal(data.status, 'ok')
  assert.deepEqual(data.data.data.parameters, ['exposure'])
  assert.equal(data.data.data.message, 'increment')

  server.close()
})

test('server handles increment/decrement with amount parameter', async () => {
  const mockSocket = {
    send: (parameters, message) => Promise.resolve({ success: true, data: { parameters, message } }),
  }

  const port = await getPort()
  const server = await createHttpServer(port)(mockSocket)
  const address = server.address()

  // Test increment with amount
  const response = await fetch(`http://localhost:${address.port}/exposure/increment?amount=0.5`)
  const data = await response.json()

  assert.equal(response.status, 200)
  assert.equal(data.status, 'ok')
  assert.deepEqual(data.data.data.parameters, ['exposure', 0.5])
  assert.equal(data.data.data.message, 'increment')

  server.close()
})

test('server returns 404 for invalid URL pattern', async () => {
  const mockSocket = {
    send: () => ({ success: true, data: 'test' }),
  }

  const port = await getPort()
  const server = await createHttpServer(port)(mockSocket)
  const address = server.address()

  // Test invalid URL pattern
  const response = await fetch(`http://localhost:${address.port}/invalid`)
  const data = await response.json()

  assert.equal(response.status, 404)
  assert.equal(data.status, 'not found')

  server.close()
})

test('server returns 500 when socket send fails', async () => {
  const mockSocket = {
    send: () => Promise.resolve({ success: false, error: 'Socket error' }),
  }

  const port = await getPort()
  const server = await createHttpServer(port)(mockSocket)
  const address = server.address()

  const response = await fetch(`http://localhost:${address.port}/exposure/increment`)
  const data = await response.json()

  assert.equal(response.status, 500)
  assert.equal(data.status, 'internal server error')

  server.close()
})

test('server handles invalid amount parameter gracefully', async () => {
  const mockSocket = {
    send: (parameters, message) => Promise.resolve({ success: true, data: { parameters, message } }),
  }

  const port = await getPort()
  const server = await createHttpServer(port)(mockSocket)
  const address = server.address()

  // Test with invalid amount (should ignore it)
  const response = await fetch(`http://localhost:${address.port}/exposure/increment?amount=invalid`)
  const data = await response.json()

  assert.equal(response.status, 200)
  assert.equal(data.status, 'ok')
  assert.deepEqual(data.data.data.parameters, ['exposure']) // Should not include invalid amount
  assert.equal(data.data.data.message, 'increment')

  server.close()
})
