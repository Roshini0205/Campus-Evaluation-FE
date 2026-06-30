import { useState, useEffect, useCallback } from 'react'
import { fetchNotifications } from '../api/notification'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Button,
  Grid,
  Pagination
} from '@mui/material'
import { createLog } from '../utils/logger'

function AllNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState('')
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [totalNotifications, setTotalNotifications] = useState(0)

  const notificationTypes = ['', 'Event', 'Result', 'Placement']

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        limit: limit,
        page: page
      }
      if (filterType) {
        params.notification_type = filterType
      }

      const data = await fetchNotifications(params)
      
      if (data && data.notifications) {
        setNotifications(data.notifications)
        setTotalNotifications(data.notifications.length)
        await createLog(
          'frontend',
          'info',
          'page',
          `Displaying ${data.notifications.length} notifications on page ${page}`
        )
      }
    } catch (err) {
      setError('Failed to load')
      await createLog(
        'frontend',
        'error',
        'page',
        `Error loading notifications: ${err.message}`
      )
    } finally {
      setLoading(false)
    }
  }, [limit, page, filterType])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const getTypeColor = (type) => {
    switch(type) {
      case 'Placement': return 'success'
      case 'Result': return 'info'
      case 'Event': return 'warning'
      default: return 'default'
    }
  }

  const handleFilterChange = (event) => {
    setFilterType(event.target.value)
    setPage(1)
  }

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value))
    setPage(1)
  }

  if (loading && notifications.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        All Notifications
      </Typography>

      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Filter by Type"
              value={filterType}
              onChange={handleFilterChange}
              fullWidth
              size="small"
            >
              {notificationTypes.map((type) => (
                <MenuItem key={type || 'all'} value={type}>
                  {type || 'All Types'}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Items per page"
              value={limit}
              onChange={handleLimitChange}
              fullWidth
              size="small"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              onClick={loadNotifications}
              fullWidth
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {notifications.length === 0 && !error && (
        <Alert severity="info">
          No notifications found.
        </Alert>
      )}

      <Box>
        {notifications.map((notification) => (
          <Card key={notification.ID} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom>
                    {notification.Message}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
                    <Chip
                      label={notification.Type}
                      color={getTypeColor(notification.Type)}
                      size="small"
                    />
                    <Chip
                      label={`ID: ${notification.ID.substring(0, 8)}...`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {notification.Timestamp}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {notifications.length > 0 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(totalNotifications / limit)}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
}

export default AllNotifications