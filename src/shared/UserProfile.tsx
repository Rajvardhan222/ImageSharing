import React from "react";

function UserProfile({ profile }) {
  console.log(profile);

  return profile?.map((users, index) => {
    return (
      <div className=" flex flex-col justify-center items-center gap-y-4 px-10 py-12   w-64 " key={index}>
        <img
          src={users?.imageUrl||"assets/icons/profile-placeholder.svg"}
          className="w-[96px] h-[96px] rounded-full"
        ></img>
        <h2 className="font-bold text-2xl">{users.name}</h2>
        <p className="text-[#7878A3] font-medium text-lg ">@{users.userName}</p>
        <button className="bg-[#877EFF] text-white px-5 py-3 w-28 h-10 font-semibold text-center text-sm rounded-md">
          Follow
        </button>
      </div>
    );
  });
}

export default UserProfile;
