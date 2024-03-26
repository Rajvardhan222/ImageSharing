import React from 'react'
import Loader from './Loader'
import { LoaderCircle } from 'lucide-react'

function SearchResults({
  isSearchFetching,
  searchedPosts
}) {
  if(isSearchFetching) return  <LoaderCircle/>
  return (
    <div>SearchResults</div>
  )
}

export default SearchResults