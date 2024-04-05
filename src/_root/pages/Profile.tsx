import { useUserContext } from "@/context/AuthContext";
import authservice from "@/lib/appwrite/user";
import { useGetCurrentUser } from "@/lib/react-query/queriesandMutations";
import React, { useEffect, useState } from "react";

function Profile() {
  const { user:mydetail } = useUserContext();
  let {data:user} = useGetCurrentUser()
 
  useEffect(()=>{
    console.log(user);
  },[user])
  
  
  


  
  return (
    <>
      <div className="flex flex-col w-full overflow-scroll ml-10 mt-14">
        <div className="flex ">
          <div>
            <img
              src="/assets/icons/profile-placeholder.svg"
              className=" h-36 w-36 "
            ></img>
          </div>
          <div className="flex flex-col ml-7 gap-y-4">
            <div className="flex justify-between min-w-26">
              <h3 className=" font-semibold text-4xl ">User Name</h3>
              <button className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                <img
                  src="/assets/icons/edito.svg"
                  width={20}
                  height={20}
                  alt="filter"

                />
                <p className="small-medium md:base-medium text-light-2">Edit</p>
              </button>
            </div>
            <div className="text-[#7878A3] font-normal text-lg ">
                @username
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
              <div className="flex flex-col">
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
            🌿 Capturing the essence of nature through my lens 
✨ "In every walk with nature, one receives far more than he seeks." - John Muir
            </div>
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
      </div>
    </>
  );
}

export default Profile;
