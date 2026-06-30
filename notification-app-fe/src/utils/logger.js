import axios from 'axios'

const API_BASE_URL = ''
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN

export const createLog = async (stack, level, packageName, message) => {
  const validStacks = ['backend', 'frontend']
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal']
  const validPackages = [
    'api', 'component', 'hook', 'page', 'state', 'style',
    'auth', 'config', 'middleware', 'utils'
  ]

  if (!validStacks.includes(stack)) {
    console.error('Invalid stack:', stack)
    return
  }
  if (!validLevels.includes(level)) {
    console.error('Invalid level:', level)
    return
  }
  if (!validPackages.includes(packageName)) {
    console.error('Invalid package:', packageName)
    return
  }

  try {
    const response = await axios.post(
      `/evaluation-service/logs`,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Failed to create log:', error.message)
  }
}