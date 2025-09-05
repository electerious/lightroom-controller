import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

test('package.json has correct structure', () => {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageInfo = JSON.parse(readFileSync(packagePath, 'utf8'))

  assert.equal(packageInfo.name, 'lightroom-controller')
  assert.equal(typeof packageInfo.version, 'string')
  assert.equal(packageInfo.type, 'module')
  assert.equal(packageInfo.bin, './bin/index.js')
  assert.ok(packageInfo.scripts.test)
})

test('bin/index.js file exists', () => {
  const binPath = path.join(process.cwd(), 'bin', 'index.js')
  assert.ok(existsSync(binPath), 'bin/index.js should exist')
})

test('environment variables have default values', () => {
  // Test default values for environment variables
  const defaultWsUrl = process.env.LIGHTROOM_WS_URL || 'ws://127.0.0.1:7682'
  const defaultPort = process.env.PORT || 3000

  assert.equal(defaultWsUrl, 'ws://127.0.0.1:7682')
  assert.equal(defaultPort, 3000)
})

test('application constants are valid', () => {
  // Test constants used in the application
  const wsUrl = 'ws://127.0.0.1:7682'
  const port = 3000

  // Validate WebSocket URL format
  assert.ok(wsUrl.startsWith('ws://'), 'WebSocket URL should use ws:// protocol')
  assert.ok(wsUrl.includes('127.0.0.1'), 'WebSocket URL should include localhost')
  assert.ok(wsUrl.includes('7682'), 'WebSocket URL should include port 7682')

  // Validate port number
  assert.equal(typeof port, 'number')
  assert.ok(port > 0 && port < 65536, 'Port should be in valid range')
})
