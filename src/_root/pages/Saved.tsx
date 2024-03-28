import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/queriesandMutations";
import GridPostSave from "@/shared/GridPostSave.tsx";
import { Loader2Icon } from "lucide-react";
import React from "react";

function Saved() {
  
  let {user} = useUserContext()
  let {
    data: savedPost,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useGetSavedPosts(user.id);
  console.log(savedPost);
  const shouldShowPosts = savedPost?.pages.every((item) => item?.documents.length === 0);
  return (
    <div className="flex flex-col w-full ml- explore-container">
      <div className="flex md:w-full w-full md:mt-10 gap-2  ">
        <img
          src="/assets/icons/save.svg"
          className=" fill-white text-8xl"
        ></img>
        <p className=" md:text-3xl font-bold">Saved Posts</p>
      </div>

      <div className="flex justify-start mt-7   w-full ml-4 px-2">
        <div className="flex  mt-3 gap-2 w-96">
          <img src="/assets/icons/posts.svg" className=" fill-white "></img>
          <p className="  font-bold ">Saved Posts</p>
        </div>

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
      <div className="flex flex-wrap gap-9 w-full max-w-5xl mt-10">
      {shouldShowPosts ?  
  <p className="text-light-4 mt-10 text-center w-full">End of posts</p> :
  savedPost?.pages.map((page, pageIndex) => (
    <GridPostSave key={`page-${pageIndex}-post-`} posts={page?.documents} />
   
  ))
}

</div>


    </div>
  );
}

export default Saved;
