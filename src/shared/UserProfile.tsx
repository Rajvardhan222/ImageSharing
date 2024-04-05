import { useUserContext } from "@/context/AuthContext";
import authservice from "@/lib/appwrite/user";
import { useGetCurrentUser } from "@/lib/react-query/queriesandMutations";
import React, { useEffect, useState } from "react";

function UserProfile({ profile }) {
    const { user:mydetail } = useUserContext();
    let {data:user} = useGetCurrentUser()
    let [meFollowing,setMeFOllowing] = useState(user?.MeFollowing)
    let [meFollowingCnt,setMeFOllowingCnt] = useState(user?.MeFollowingCnt)
    let [Follower,SetFollower] = useState(user?.follower)
    let [FollowerCnt,SetFollowerCnt] = useState(user?.FollowerCnt)
    // const [Follow, setFollow] = useState(user.following)
  console.log(profile);
  let handleFollow = async (ids) => {
          
    if (meFollowing.some(item => item===ids)) {
    let removeMeFollow = meFollowing.filter((item)=>{
      return item!=ids
    })
    setMeFOllowing(removeMeFollow)
    authservice.removeMeFollowing(meFollowing,mydetail.id,meFollowingCnt)
  } else {
       setMeFOllowing([...meFollowing,ids])

       authservice.addMeFollowing(meFollowing,mydetail.id,meFollowingCnt)
  }

  if(Follower.some(item=> item===mydetail.id)){
    let removeFOllower = Follower.filter((item)=>{
      return item!==mydetail.id
    })

  SetFollower(removeFOllower)

  authservice.removeFollowers(Follower,ids,FollowerCnt)
  }else{
    SetFollower([...Follower,mydetail.id])
    authservice.addFollowers(Follower,ids,FollowerCnt)
  }
 
  
  
  }

// useEffect(()=>{
//     console.log(mydetail.id,Follow);
    
//     authservice.FollowUser(mydetail.id,Follow)
// },[Follow])
  return profile?.map((users, index) => {
    return (
      <div className=" flex flex-col justify-center items-center gap-y-4 px-10 py-12   w-64 " key={index}>
        <img
          src={users?.imageUrl||"assets/icons/profile-placeholder.svg"}
          className="w-[96px] h-[96px] rounded-full"
        ></img>
        <h2 className="font-bold text-2xl">{users.name}</h2>
        <p className="text-[#7878A3] font-medium text-lg ">@{users.userName}</p>
        <button className="bg-[#877EFF] text-white px-5 py-3 w-28 h-10 font-semibold text-center text-sm rounded-md"
        onClick={()=> handleFollow(users.$id)}
        >
         {meFollowing.some(item=>item===users.$id) ? "UnFollow":"Follow"}
        </button>
      </div>
    );
  });
}

export default UserProfile;
