import { useUserContext } from "@/context/AuthContext";
import authservice from "@/lib/appwrite/user";
import {
  useGetCurrentUser,
  useGetUserById,
  useUpdateAddFollower,
  useUpdatePostFollowing,
  useUpdatePostMeFollowing,
  useUpdateRemoveFollower,
} from "@/lib/react-query/queriesandMutations";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Profilecard({
  users,
  meFollowing,
  setMeFOllowing: setMeFOllowing,
  FollowerCnt,
  meFollowingCnt,
}) {
  const { user: mydetail } = useUserContext();

  let [Follower, SetFollower] = useState(users?.follower);

  const { mutate: removeFollowing } = useUpdatePostFollowing();
  const { mutate: addFollowing } = useUpdatePostMeFollowing();
  const { mutate: followingadd } = useUpdateAddFollower();
  const { mutate: followingRemove } = useUpdateRemoveFollower();

  const handleFollow = async (ids) => {
    if (meFollowing.some((item) => item === ids)) {
      // Unfollow action
      const removeMeFollow = meFollowing.filter((item) => item !== ids);
      setMeFOllowing(removeMeFollow);
      removeFollowing({
        removeMeFollow,
        mydetail: mydetail.id,
        meFollowingCnt,
      });
    } else {
      // Follow action
      setMeFOllowing((prevMeFollowing) => [...prevMeFollowing, ids]);
      const newFollowerMe = [...meFollowing, ids];
      //newFollowerMe);

      addFollowing({
        newFollowerMe: newFollowerMe,
        mydetail: mydetail.id,
        meFollowingCnt: meFollowingCnt,
      });
    }

    if (Follower?.some((item) => item === mydetail.id)) {
      // Already a follower, so unfollow
      const removeFollower = Follower.filter((item) => item !== mydetail.id);
      SetFollower(removeFollower);
      followingRemove({ newFollower: removeFollower, ids, FollowerCnt });
    } else {
      // Not a follower, so follow
      SetFollower((prevFollower) => [...prevFollower, mydetail.id]);
      const newFollower = [...Follower, mydetail.id];
      followingadd({ newFollower, ids, FollowerCnt });
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center gap-y-4 px-10 py-12   w-64 ">
      <Link to={`/../profile/${users.$id}`}>
        <img
          src={users?.imageUrl || "assets/icons/profile-placeholder.svg"}
          className="w-[96px] h-[96px] rounded-full"
        ></img>
      </Link>
      <h2 className="font-bold text-2xl">{users.name}</h2>
      <p className="text-[#7878A3] font-medium text-lg ">@{users.userName}</p>
      <button
        className="bg-[#877EFF] text-white px-5 py-3 w-28 h-10 font-semibold text-center text-sm rounded-md"
        onClick={() => handleFollow(users.$id)}
      >
        {meFollowing.some((item) => item === users.$id) &&
        Follower?.some((item) => item === mydetail.id)
          ? "UnFollow"
          : "Follow"}
      </button>
    </div>
  );
}

export default Profilecard;
