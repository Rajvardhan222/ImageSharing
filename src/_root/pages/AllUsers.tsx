import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetInfinityUser, useGetInfinityUserSearch } from "@/lib/react-query/queriesandMutations";
import SearchUserResult from "@/shared/SearchUserResult";
import UserProfile from "@/shared/UserProfile"
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";


function AllUsers() {
  const [searchValue, setSearchValue] = useState('')
  const {data:user,hasNextPage,isFetchingNextPage,fetchNextPage,isFetching} = useGetInfinityUser()
  //user);
  const debouncedSearch = useDebounce(searchValue, 500);
  const {data:searchResult,isFetching:isSearchFetching,hasNextPage:searchHasNextPage,fetchNextPage:fetchSearchNextPage} = useGetInfinityUserSearch(debouncedSearch)
  const { ref, inView } = useInView();
  //searchResult);
  

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
    if (inView && searchValue) {
      fetchSearchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (debouncedSearch !== '') {
      //debouncedSearch);
      
      fetchSearchNextPage();
    }
  }, [debouncedSearch]);
  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && 
    user?.pages.every((item) => item?.documents.length === 0);
  return (
    <div className='flex flex-col w-full ml-5 gap-y-7 overflow-scroll  '>
      
    <div className='flex  w-full justify-start'>
        <div className=' flex items-center gap-2 mt-7'>
            <img src='/assets/icons/UsersGroupRounded.svg'>
            </img>
            <p className="font-bold text-2xl">All Users</p>
        </div>
    </div>
    <div className="flex gap-1 px-4 lg:w-[80%] w-[90%] rounded-lg bg-dark-4">
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
    <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-auto sm:m-0">
         { shouldShowSearchResults ? 
        searchResult?.pages.map((page, index) =>{
            return <UserProfile profile={page?.documents} key={index}/> 
        })
         :

         !shouldShowPosts ? 
         
         user?.pages.map((item,index) => {
            return (
              <UserProfile key={index} profile={item?.documents}/>
            )
          }) : <p className="text-light-4 mt-10 text-center w-full">No User</p>}
    </div>
    {hasNextPage && !searchValue && (
      <div  className="mt-10 mx-auto mb-10" ref={ref}>
       <Loader2Icon className="animate-spin" size={50}/>
      </div>
    )}
     {searchHasNextPage &&   (
      <div  className="mt-10 mx-auto mb-10" ref={ref}>
       <Loader2Icon className="animate-spin" size={50}/>
      </div>
    )}
    {!hasNextPage && !searchValue && !isFetching && (
      <div  className="mt-10 mx-auto mb-10" ref={ref}>
      <p>Nothing More</p>
      </div>
    )}
  </div>
  )
}

export default AllUsers