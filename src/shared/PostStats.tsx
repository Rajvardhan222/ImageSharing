import { useUserContext } from "@/context/AuthContext";
import authservice from "@/lib/appwrite/user";
import {
  useDeletePOst,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesandMutations";
import React, { useContext, useEffect, useState } from "react";
import Loader from "./Loader";

function PostStats({ post, userId }) {
  const  {data:currentUser} = useGetCurrentUser();
  const likeslist = post.likes.map((user) => user.$id);
  const SaveList = post.save.map((user) => user.$id)

  const [likes, setLikes] = useState(likeslist);
  const [save, setSave] = useState(false)
  const { mutate: likePost } = useLikePost();
  const { mutate: SavePost ,isPending : isSaving} = useSavePost();
  const { mutate: deleteSavePost ,isPending : isdeleting} = useDeletePOst();

  
  let handlelike = () => {
    
    if (likes.includes(userId)) {
      setLikes(likes.filter((id) => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }
  
  };


  let handleSave = async() => {
    
    console.log(currentUser);
    
   let  savePostRecord = currentUser?.saves.find(record => record.posts.$id === post.$id )
   
   console.log(savePostRecord);
   
    if(!!savePostRecord){
      setSave(false)
       deleteSavePost(savePostRecord.$id);
       
    }else{
      SavePost({postId:post.$id,UserId:userId});
      setSave(true);
    }
  
  };

  useEffect(()=>{
    let  savePostRecord = currentUser?.saves.find(record => (record.posts.$id === post.$id
      ) )
    console.log(savePostRecord);
    
    if(!!savePostRecord){
      setSave(true)
    }
  },[SavePost,currentUser])

  let checkIsLiked = (like, id) => {
    console.log('entered');
    
    if (like.includes(id)) {
        console.log(like);
        
      return true;
    } else {
        console.log('false');
        
      return false;
    }
  };

  // let checkIsSaved = (savePost, id) => {
  //   return savePost.includes(id)
  // }

  useEffect(() => {
    likePost({ postId: post.$id, likesArray: likes });
  }, [likes]);

  

  // useEffect(() => {
  //   SavePost({ postId: post.$id, UserId: userId });
  //   console.log(save);
    
  // }, [save]);

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        
          <img
            src={`${
              checkIsLiked(likes, userId)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }`}
            alt="like"
            width={20}
            height={20}
            onClick={() => handlelike()}
            className="cursor-pointer"
          />
        

        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2 ">
       {isSaving || isdeleting ? <Loader/> : <img
          src={`${
            save
              ? "/assets/icons/saved.svg"
              : "/assets/icons/save.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={() => {handleSave()}}
          className="cursor-pointer"
        ></img>}
      </div>
    </div>
  );
}

export default PostStats;
