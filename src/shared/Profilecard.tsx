import { useUserContext } from '@/context/AuthContext';
import authservice from '@/lib/appwrite/user';
import { useGetCurrentUser, useGetUserById } from '@/lib/react-query/queriesandMutations';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Profilecard({users,meFollowing,setMeFOllowing:setMeFollowing,FollowerCnt,meFollowingCnt}) {
    const { user:mydetail } = useUserContext();
    let {data:user} = useGetCurrentUser()
    let { data: uniqueUser } = useGetUserById(users.$id);
    let [Follower,setFollower] = useState(uniqueUser?.follower)
    const handleFollow = async (ids) => {
        try {
            console.log(meFollowing);
            
            if (meFollowing.some(item => item === ids)) {
                // Unfollow action
                const updatedMeFollowing = meFollowing.filter(item => item !== ids);
                setMeFollowing(updatedMeFollowing);
                await authservice.removeMeFollowing(updatedMeFollowing, mydetail.id, meFollowingCnt);
            } else {
                // Follow action
                setMeFollowing(prevMeFollowing => [...prevMeFollowing, ids]);
                const newFollowerMe = [...meFollowing, ids];
                await authservice.addMeFollowing(newFollowerMe, mydetail.id, meFollowingCnt);
            }
    console.log(Follower);
    
            if (Follower?.some(item => item === mydetail.id)) {
                // Already a follower, so unfollow
                const updatedFollower = Follower.filter(item => item !== mydetail.id);
                setFollower(updatedFollower);
                console.log(ids);
                await authservice.removeFollowers(updatedFollower, ids, FollowerCnt);
            } else {
                // Not a follower, so follow
                console.log('add');
                setFollower(prevFollower => [...prevFollower, mydetail.id]);
                const newFollower = [...Follower, mydetail.id];
                console.log(newFollower, ids, FollowerCnt);
                console.log(newFollower);
                await authservice.addFollowers(newFollower, ids, FollowerCnt);
            }
        } catch (error) {
            // Handle errors
            console.error("Error occurred while handling follow:", error);
            // Optionally, set state or show an error message to the user
        }
    };
    
  return (
    <div className=" flex flex-col justify-center items-center gap-y-4 px-10 py-12   w-64 ">
        <Link to={`/../profile/${users.$id}`}>
        <img
          src={users?.imageUrl||"assets/icons/profile-placeholder.svg"}
          className="w-[96px] h-[96px] rounded-full"
        ></img>
        </Link>
        <h2 className="font-bold text-2xl">{users.name}</h2>
        <p className="text-[#7878A3] font-medium text-lg ">@{users.userName}</p>
        <button className="bg-[#877EFF] text-white px-5 py-3 w-28 h-10 font-semibold text-center text-sm rounded-md"
        onClick={()=> handleFollow(users.$id)}
        >
         {meFollowing.some(item=>item===users.$id)  && Follower?.some(item => item === mydetail.id) ? "UnFollow":"Follow"}
        </button>
      </div>
  )
}

export default Profilecard