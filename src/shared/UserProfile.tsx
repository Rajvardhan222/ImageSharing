import { useUserContext } from "@/context/AuthContext";
import authservice from "@/lib/appwrite/user";
import { useGetCurrentUser } from "@/lib/react-query/queriesandMutations";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Profilecard from "./Profilecard";

function UserProfile({ profile }) {
  const { user: mydetail } = useUserContext();
  let { data: user } = useGetCurrentUser();
  let [meFollowing, setMeFOllowing] = useState(user?.MeFollowing);
  let [meFollowingCnt, setMeFOllowingCnt] = useState(user?.MeFollowingCnt);
  let [Follower, SetFollower] = useState(user?.follower);
  let [FollowerCnt, SetFollowerCnt] = useState(user?.FollowerCnt);
  // const [Follow, setFollow] = useState(user.following)
  //profile);

  //user);

  // useEffect(()=>{
  //     //mydetail.id,Follow);

  //     authservice.FollowUser(mydetail.id,Follow)
  // },[Follow])
  return profile?.map((users, index) => {
    return (
      <Profilecard
        users={users}
        key={index}
        meFollowing={meFollowing}
        setMeFOllowing={setMeFOllowing}
        meFollowingCnt={meFollowingCnt}
        FollowerCnt={FollowerCnt}
      />
    );
  });
}

export default UserProfile;
