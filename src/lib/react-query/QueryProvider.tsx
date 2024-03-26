import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

function QueryProvider({children}) {
    let queryClient = new QueryClient()
  return (
    <QueryClientProvider
    client={queryClient}
    >

        {children}
    </QueryClientProvider>
  )
}

export default QueryProvider