import React from 'react'
import GridPostList from './GridPostList';
import Loader from './Loader';

type SearchResultsProps={
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
}

const SearchResults = ({isSearchFetching, searchedPosts}: SearchResultsProps) => {
  
  if(isSearchFetching) return <Loader/>
  if(searchedPosts && searchedPosts.documents.length >0) {
    return (
      <GridPostList post={searchedPosts.documents}/>
    )
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  )
}

export default SearchResults
