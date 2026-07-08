import path from 'node:path'

const DEFAULT_ENV_PATH = path.resolve(process.cwd(), '.env')

export const loadEnv = (configPath) => {
  try {
    process.loadEnvFile(configPath || DEFAULT_ENV_PATH)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}
