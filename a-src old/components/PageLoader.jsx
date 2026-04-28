import React from 'react'
import Layout from '../layout/Layout'
import { CircularProgress } from '@mui/material'
import { Typography } from '@mui/material'

const PageLoader = () => {
  return (
    <Layout>
    <div className="flex flex-col items-center justify-center py-12">
    <CircularProgress size={60} thickness={4} className="text-blue-500" />
    <Typography variant="h6" className="mt-4 text-gray-600">
      Loading data...
    </Typography>
  </div>
  </Layout>
  )
}

export default PageLoader