import axios from 'axios'
import { createLog } from '../utils/logger'

const API_BASE_URL = ''
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN

export function fetchNotifications(params = {}) {
  console.log('Fetching notifications with params:', params)
  console.log('Using token:', ACCESS_TOKEN ? 'Token exists' : 'Token missing')
  
  return axios
    .get(`/evaluation-service/notifications`, {
      params,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
    })
    .then(response => {
      console.log('Response received:', response.data)
      createLog(
        'frontend',
        'info',
        'api',
        `Fetched ${response.data.notifications?.length || 0} notifications`
      )
      return response.data
    })
    .catch(error => {
      console.error('Full error:', error)
      console.error('Error response:', error.response)
      console.error('Error message:', error.message)
      
      createLog(
        'frontend',
        'error',
        'api',
        `Failed to fetch notifications: ${error.message}`
      )
      throw error
    })
}