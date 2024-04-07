import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import authservice from "@/lib/appwrite/user";
import {
  useGetCurrentUser,
  useGetUserById,
  useGetUserPosts,
  useUpdateAddFollower,
  useUpdatePostFollowing,
  useUpdatePostMeFollowing,
  useUpdateRemoveFollower,
} from "@/lib/react-query/queriesandMutations";
import GridPostList from "@/shared/GridPostList";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";

function Profile() {
  const { user: mydetail } = useUserContext();
  let { data: user } = useGetCurrentUser();
  let { id } = useParams();
  let { data: uniqueUser } = useGetUserById(id);
  let [meFollowing, setMeFOllowing] = useState(user?.MeFollowing);
  let [meFollowingCnt, setMeFOllowingCnt] = useState(user?.MeFollowingCnt);
  let [Follower, SetFollower] = useState(uniqueUser?.follower);
  let [FollowerCnt, SetFollowerCnt] = useState(user?.FollowerCnt);
  const { mutate: removeFollowing } = useUpdatePostFollowing();
  const { mutate: addFollowing } = useUpdatePostMeFollowing();
  const { mutate: followingadd } = useUpdateRemoveFollower();
  const { mutate: followingRemove } = useUpdateAddFollower();
  const handleFOllow = async (ids) => {
    if (meFollowing.some(item => item === ids)) {
      // Unfollow action
      const removeMeFollow = meFollowing.filter(item => item !== ids);
      setMeFOllowing(removeMeFollow);
      removeFollowing({ removeMeFollow, mydetail: mydetail.id, meFollowingCnt });
    } else {
      // Follow action
      setMeFOllowing(prevMeFollowing => [...prevMeFollowing, ids]);
      const newFollowerMe = [...meFollowing, ids];
      console.log(newFollowerMe);
      
      addFollowing({ newFollowerMe:newFollowerMe, mydetail: mydetail.id, meFollowingCnt:meFollowingCnt });
    }
  
    if (Follower?.some(item => item === mydetail.id)) {
      // Already a follower, so unfollow
      const removeFollower = Follower.filter(item => item !== mydetail.id);
      SetFollower(removeFollower);
      followingRemove({ newFollower: removeFollower, ids, FollowerCnt });
    } else {
      // Not a follower, so follow
      SetFollower(prevFollower => [...prevFollower, mydetail.id]);
      const newFollower = [...Follower, mydetail.id];
      followingadd({ newFollower, ids, FollowerCnt });
    }
  };
  
  let {
    data: userPost,
    fetchNextPage,
    hasNextPage,
  } = useGetUserPosts(uniqueUser?.$id);

  console.log(userPost);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  return (
    <>
      <div className="flex flex-col w-full overflow-scroll md:ml-10 mt-14 ">
        <div className="flex-col flex items-center md:flex-row md:items-start">
          <div>
            <img
              src={
                uniqueUser?.imageUrl || "/assets/icons/profile-placeholder.svg"
              }
              className=" h-36 w-36 rounded-full"
            ></img>
          </div>
          <div className="flex flex-col ml-0 md:ml-7 gap-y-4 md:gap-y-3">
            <div className="flex md:justify-between min-w-26 justify-center mt-5 md:mt-0">
              <h3 className=" font-semibold text-4xl ">{uniqueUser?.name}</h3>
              {mydetail.id === uniqueUser?.$id ? (
                <div className="hidden md:inline-block">
                  <button className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2  cursor-pointer ">
                    <img
                      src="/assets/icons/edito.svg"
                      width={20}
                      height={20}
                      alt="filter"
                    />
                    <p className="small-medium md:base-medium text-light-2">
                      Edit
                    </p>
                  </button>
                </div>
              ) : (
                <div className="hidden md:inline-block ">
                  <Button
                    className="bg-blue-400 hover:bg-blue-500"
                    onClick={() => handleFOllow(id)}
                  >
                  {meFollowing.some(item=>item===id) ? "UnFollow":"Follow"}
                  </Button>
                </div>
              )}
            </div>
            <div className="text-[#7878A3] font-normal text-lg   text-center md:text-start">
              @{uniqueUser?.userName}
            </div>
            <div className="flex gap-x-8">
              <div className="flex flex-col">
                <p className="text-[#877EFF] text-xl text-center">
                  {uniqueUser && uniqueUser.posts.length}
                </p>
                <p>Posts</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-[#877EFF] text-xl text-center">
                  {uniqueUser && uniqueUser.follower.length}
                </p>
                <p>Followers</p>
              </div>
              <div className="flex flex-col">
                <p className="text-[#877EFF] text-xl text-center">
                  {uniqueUser && uniqueUser.MeFollowing.length}
                </p>
                <p>Following</p>
              </div>
            </div>
            <div className="max-w-[50%]">{uniqueUser?.bio}</div>
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
          {userPost?.pages.map((posts, index) => {
            return (
              <GridPostList
                posts={posts.documents}
                showStats={false}
                showUser={false}
              />
            );
          })}
        </div>
        {hasNextPage && (
          <div className="flex justify-center py-20" ref={ref}>
            <Loader2 className="  animate-spin " />
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
