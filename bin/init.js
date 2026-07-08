import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import prompts from 'prompts'

const questions = [
  {
    type: 'text',
    name: 'lightroom_ws_url',
    message: 'Lightroom WebSocket URL',
    initial: 'ws://127.0.0.1:7682',
    validate: (input) => {
      if (URL.canParse(input)) return true
      return 'Input must be a valid URL'
    },
  },
  {
    type: 'text',
    name: 'port',
    message: 'HTTP server port',
    initial: '3000',
    validate: (input) => {
      const num = Number.parseInt(input, 10)
      if (Number.isInteger(num) && num > 0 && num <= 65535) return true
      return 'Input must be a valid port number (1-65535)'
    },
  },
]

export const init = async () => {
  const values = await prompts(questions)

  const env = `
LIGHTROOM_WS_URL=${values.lightroom_ws_url ?? ''}
PORT=${values.port ?? ''}
`.trim()

  const filePath = path.resolve(process.cwd(), '.env')

  fs.writeFileSync(filePath, env, { encoding: 'utf8' })
  console.log(`File with environment variables created at '${filePath}'`)
}
