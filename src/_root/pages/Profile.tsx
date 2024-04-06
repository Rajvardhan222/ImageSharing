import { useUserContext } from "@/context/AuthContext";
import authservice from "@/lib/appwrite/user";
import { useGetCurrentUser, useGetUserPosts } from "@/lib/react-query/queriesandMutations";
import GridPostList from "@/shared/GridPostList";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function Profile() {
  const { user:mydetail } = useUserContext();
  let {data:user} = useGetCurrentUser()
        let {data:userPost,fetchNextPage,hasNextPage} = useGetUserPosts(mydetail.id)
  useEffect(()=>{
    console.log(user);
  },[user])
  
  
  

console.log(userPost);
const { ref, inView } = useInView();
  
useEffect(() => {
 if(inView) fetchNextPage()
}, [inView])

  return (
    <>
      <div className="flex flex-col w-full overflow-scroll md:ml-10 mt-14 ">
        <div className="flex-col flex items-center md:flex-row md:items-start">
          <div>
            <img
              src={user?.imageUrl ||"/assets/icons/profile-placeholder.svg"}
              className=" h-36 w-36 rounded-full"
            ></img>
          </div>
          <div className="flex flex-col ml-0 md:ml-7 gap-y-4 md:gap-y-3">
            <div className="flex md:justify-between min-w-26 justify-center mt-5 md:mt-0">
              <h3 className=" font-semibold text-4xl ">{user?.name}</h3>
              <div className="hidden md:inline-block">
              <button className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2  cursor-pointer ">
                <img
                  src="/assets/icons/edito.svg"
                  width={20}
                  height={20}
                  alt="filter"

                />
                <p className="small-medium md:base-medium text-light-2">Edit</p>
              </button>
              </div>
            </div>
            <div className="text-[#7878A3] font-normal text-lg   text-center md:text-start">
                @{user?.userName}
            </div>
            <div className="flex gap-x-8">
              <div className="flex flex-col">
                <p className="text-[#877EFF] text-xl text-center">
                  {user&&user.posts.length}
                </p>
                <p>
                  Posts
                </p>

              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-[#877EFF] text-xl text-center">
                  {user && user.FollowerCnt}
                </p>
                <p>
                  Followers
                </p>

              </div>
              <div className="flex flex-col">
                <p className="text-[#877EFF] text-xl text-center">
                  {user && user.MeFollowingCnt}
                </p>
                <p>
                  Following
                </p>

              </div>
            </div>
            <div className="max-w-[50%]">
            {user?.bio}
            </div>
            <button className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2  cursor-pointer md:hidden">
                <img
                  src="/assets/icons/edito.svg"
                  width={20}
                  height={20}
                  alt="filter"

                />
                <p className="small-medium md:base-medium text-light-2">Edit</p>
              </button>
          </div>
        </div>
        <div className="flex justify-between mt-7  max-w-[90%] w-full ml-4 px-2">
        <div className="flex  mt-3 gap-2 w-96">
          <img src="/assets/icons/posts.svg" className=" fill-white "></img>
          <p className="  font-bold ">Posts</p>
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

      <div className="w-full   grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-8 mt-8">
          {
            userPost?.pages.map((posts,index)=>{
             return <GridPostList posts={posts.documents} showStats={false} showUser={false}/>
            })
          }
      </div >
         {hasNextPage && <div className="flex justify-center py-20" ref={ref}>
            <Loader2 className="  animate-spin "/>
          </div>}
      </div>
    </>
  );
}

export default Profile;
