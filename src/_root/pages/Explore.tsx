import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useInView } from "react-intersection-observer";

import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesandMutations";
import GridPostList from "@/shared/GridPostList";

import Loader from "@/shared/Loader"; 
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
const SearchResults = ({ isSearchFetching, searchedPosts }) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

function Explore() {
  const { ref, inView } = useInView();
  
  const { data: posts, fetchNextPage, hasNextPage ,isFetching} = useGetPosts();
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue, 500);
  let {data:searchPosts , isFetching:isSearchFetching} = useSearchPosts(debouncedSearch)

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && 
    posts?.pages.every((item) => item?.documents.length === 0);
//posts);
useEffect(() => {
  if (inView && !searchValue) {
    fetchNextPage();
  }
}, [inView]);
   
  return (
    <div className="explore-container">
    <div className="explore-inner_container">
      <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
      <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
        <img
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
        />
        <Input
          type="text"
          placeholder="Search"
          className="explore-search"
          value={searchValue}
          onChange={(e) => {
            const { value } = e.target;
            setSearchValue(value);
          }}
        />
      </div>
    </div>

    <div className="flex-between w-full max-w-5xl mt-16 mb-7">
      <h3 className="body-bold md:h3-bold">Popular Today</h3>

      <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
        <p className="small-medium md:base-medium text-light-2">All</p>
        <img
          src="/assets/icons/filter.svg"
          width={20} 
          height={20}
          alt="filter"
        />
      </div>
    </div>

    <div className="flex flex-wrap gap-9 w-full max-w-5xl">
      {shouldShowSearchResults ? (
        <SearchResults
          isSearchFetching={isSearchFetching}
          searchedPosts={searchPosts}
        />
      ) : shouldShowPosts ? (
        <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
      ) : (
        posts?.pages.map((item, index) => (
          <GridPostList key={`page-${index}`} posts={item.documents} />
        ))
      )}
    </div>

    {hasNextPage && !searchValue && (
      <div  className="mt-10" ref={ref}>
       <Loader2Icon className="animate-spin"/>
      </div>
    )}
    {!hasNextPage && !searchValue && !isFetching && (
      <div  className="mt-10" ref={ref}>
      <p>Nothing More</p>
      </div>
    )}
   
  </div>
);
}

export default Explore