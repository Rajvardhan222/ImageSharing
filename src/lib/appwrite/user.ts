import conf from "@/conf/conf";
import { INewPost, INewUser, IUpdatePost, IUser } from "@/types";
import { Client,Account,Databases,Storage,Avatars, ID, Query } from "appwrite";
import { Navigation, User } from "lucide-react";
import { Navigate } from "react-router-dom";


export class Auth  {
    client;
    account;
    avatar;
    database;
    storage
   

    constructor (){
        this.client = new Client()
        .setEndpoint(conf.URL) 
        .setProject(conf.PRODUCT_ID); 
      this.account = new Account(this.client);
      this.avatar = new Avatars(this.client);
      this.database = new Databases(this.client);
      this.storage = new Storage(this.client);
     
    }

async isUserThere(name){
  try {
   let user = await this.database.listDocuments(
      conf.DATABASE_ID,
      conf.USER,
      [Query.equal('userName',name)]
    )
    return user
  } catch (error) {
    //error);
    
  }
}
        async createNewAccount(user:INewUser){
          try {
            

         let newAccount = await this.account.create(ID.unique(),
           user.email,
           user.password,
           user.name,
           
         
            )

           let avatarUrl = this.avatar.getInitials(user.name)

           const newUser = await this.saveUsertoDB({
            accountId : newAccount.$id,
            email:user.email,
            name :user.name,
            imageUrl: avatarUrl,
            userName:user.username


           })
           return newUser
          } catch (error) {
            //error.message);
           throw error.message
            
          }
        }

        async saveUsertoDB(user : {accountId :string; email:string; name : string ; imageUrl:URL; userName : string}){
            try {
             return await  this.database.createDocument(
                conf.DATABASE_ID,
                conf.USER,
                ID.unique(),
                user
              )
            } catch (error) {
              //error);
              
            }


        }

        async singIn(user : {email:string; password:string; }){
          try {
            return await this.account.createEmailSession(user.email, user.password)
          } catch (error) {
            //error);
            throw error;
          }
        }

         async getCurrentUser(){
          try {
            let currentAccount = await this.account.get()

            if(!currentAccount) throw Error

            const currentUser = await this.database.listDocuments(
              conf.DATABASE_ID,
              conf.USER,
              [Query.equal('accountId', currentAccount.$id)]
            )

            if(!currentUser) throw Error
            return currentUser.documents[0]
          } catch (error) {
            //error);
            
          }
         }

          singout=async()=>{
          try {
            return await this.account.deleteSession('current')
          } catch (error) {
            //error);
            throw error.message
          }
         }

         async createPost(post :INewPost){
          try {
            const uploadedFile = await this.uploadFile(post.file[0])
              if(!uploadedFile) throw Error

              const fileUrl = await this.getFilePreview(uploadedFile.$id)
              //fileUrl);
              

              if(!fileUrl) {
                this.deleteFile(uploadedFile.$id)
                throw Error}

                const tags = post.tags?.replace(/ /g,'').split(',') || []

                const newPost = this.database.createDocument(
                  conf.DATABASE_ID,
                  conf.POSTS,
                  ID.unique(),
                  {
                    creator : post.userId,
                    caption : post.caption,
                    imageid : uploadedFile.$id,
                    imageURl : fileUrl,
                    location : post.location,
                    tags : tags,
                  }
                  
                )
                    //post.userId);
                    
                if(!newPost){
                  await this.deleteFile(uploadedFile.$id)
                  throw Error
                }

                return newPost

          } catch (error) {
            //error);
            
          }
         }

         async deleteFile(id:string) {
          try {
            await this.storage.deleteFile(conf.BUCKET_ID, id)
            return {status : 'OK'}
          } catch (error) {
            //error);
            
          }
         }
         async uploadFile(file : File){
          try {
            const uploadedFile = await this.storage.createFile(
              conf.BUCKET_ID,
              ID.unique(),
              file
            )
            return uploadedFile
          } catch (error) {
            //error);
            
          }
         }

          getFilePreview(fileId : string,quality=50){
          try {
            const fileUrl =  this.storage.getFilePreview(conf.BUCKET_ID,
              fileId,
              2000,
              2000,
              'top',
              quality
              )
              return fileUrl
          } catch (error) {
            //error);
            
          }
         }
         getRecentPosts = async({pageParam} : {pageParam:string}) =>{
          const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(7)];

          if (pageParam) {
            queries.push(Query.cursorAfter(pageParam.toString()));
          }
          try {
            const posts = await this.database.listDocuments(
              conf.DATABASE_ID,
              conf.POSTS,
             queries

              )
              if (!posts) throw Error
              //posts);
              
              return posts
          } catch (error) {
            //error);
            
          }
         }

         async likePost (postId:string,likesArray:string){
              try {
                //likesArray);
                
                const updatedPost = await this.database.updateDocument(
                  conf.DATABASE_ID,
                  conf.POSTS,
                  postId,
                  {
                    likes: likesArray,
                  }
                )
                if(!updatedPost) throw Error
                return updatedPost
              } catch (error) {
                //error);
                
              }
         }
         async addMeFollowing(Userid:Array<string>,MyAccountId:string,prevFollowCnt:number){
          try {
            //'following +1 ',Userid,prevFollowCnt);
            
           let incrementMEFollowing = await this.database.updateDocument(conf.DATABASE_ID,conf.USER,MyAccountId,
              {
                MeFollowingCnt : Number(prevFollowCnt+1),
                MeFollowing : Userid
              }
              )
              if(!incrementMEFollowing) throw Error
return incrementMEFollowing
          } catch (error) {
            //error);
            
          }
         }
         async removeMeFollowing(Userid:Array<string>,MyAccountId:string,prevFollowCnt:number){
          try {
           let incrementMEFollowing =await this.database.updateDocument(conf.DATABASE_ID,conf.USER,MyAccountId,
              {
                MeFollowingCnt : prevFollowCnt--,
                MeFollowing : Userid
              }
              )
              if(!incrementMEFollowing) throw Error
return incrementMEFollowing
          } catch (error) {
            //error);
            
          }
         }

         async addFollowers(Userid:Array<string>,MyAccountId:string,prevFollowCnt:number){
          try {
            //'adding User to DB');
            
            //Userid);
            
           let incrementMEFollowing = await this.database.updateDocument(conf.DATABASE_ID,conf.USER,MyAccountId,
              {
                FollowerCnt : Number(prevFollowCnt+1),
                follower : Userid
              }
              )
              if(!incrementMEFollowing) throw Error
return incrementMEFollowing
          } catch (error) {
            //error);
            
          }
         }

         async removeFollowers(Userid:Array<string>,MyAccountId:string,prevFollowCnt:number){
          try {
           let incrementMEFollowing = await this.database.updateDocument(conf.DATABASE_ID,conf.USER,MyAccountId,
              {
                FollowerCnt : Number(prevFollowCnt-1),
                follower : Userid
              }
              )
              if(!incrementMEFollowing) throw Error
return incrementMEFollowing
          } catch (error) {
            //error);
            
          }
         }
         async savePost (postId:string,userId:string){
          try {
            const updatedPost = await this.database.createDocument(
              conf.DATABASE_ID,
              conf.SAVES,
              ID.unique(),
              {
                users : userId,
                posts:postId
              }
            )
            if(!updatedPost) throw Error
            return updatedPost
          } catch (error) {
            //error);
            
          }
     }


     async deleteSavePost (savedRecordId:string){
      try {
        const statusCode = await this.database.deleteDocument(
          conf.DATABASE_ID,
          conf.POSTS,
          savedRecordId
        )
        if(!statusCode) throw Error
       
        return statusCode
       
      } catch (error) {
        //error);
        
      }
 }

 async getPostbyId(postId:string){
      try {
        let post = await this.database.getDocument(conf.DATABASE_ID,
          conf.POSTS,
          postId
        )
        //post);
        
        return post;
      } catch (error) {
        //error);
        
      }
 }

 async updatePost(post :IUpdatePost){
  const hasFileToUpload = post.file.length > 0;
  try {
    let image = {
      imageUrl:post.imageUrl,
      imageId:post.imageId
    }
    if (hasFileToUpload) {
      
      const uploadedFile = await this.uploadFile(post.file[0])
        if(!uploadedFile) throw Error
  
        const fileUrl = await this.getFilePreview(uploadedFile.$id)
        //fileUrl);
        if(!fileUrl) {
          this.deleteFile(uploadedFile.$id)
          throw Error}

          image = {...image, imageUrl:fileUrl, imageId:uploadedFile.$id}
    }

      


        const tags = post.tags?.replace(/ /g,'').split(',') || []

        const updatedPost = this.database.updateDocument(
          conf.DATABASE_ID,
          conf.POSTS,
          post.postId,
          {
           
            caption : post.caption,
            imageid : image.imageId,
            imageURl : image.imageUrl,
            location : post.location,
            tags : tags,
          }
          
        )

            
        if(!updatedPost){
          await this.deleteFile(post.imageId)
          throw Error
        }

        return updatedPost

  } catch (error) {
    //error);
    
  }
 }

 async downloadImage(id){
  try {
    let file = await this.storage.getFileDownload(
      conf.BUCKET_ID,
      id
    )
    return file
  } catch (error) {
    //error);
    
    throw error.message
  }
 }

 async searchPost(searchTerm:string){
  try {
    const posts = await this.database.listDocuments(
     conf.DATABASE_ID,
      conf.POSTS,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    //error);
  }
 }

getInfinitePosts=async({pageParam}: { pageParam: number })=>{
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(6)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    let posts = await this.database.listDocuments(
      conf.DATABASE_ID,
      conf.POSTS,
      queries
    );

    if (!posts) throw Error;
//posts);

    return posts;
  } catch (error) {
    //error);
  }
 }


 getInfiniteSavePosts=async({pageParam,id}: { pageParam: number, id:string })=>{
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(6),Query.equal('users', id)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    let posts = await this.database.listDocuments(
      conf.DATABASE_ID,
      conf.SAVES,
      queries
    );

    if (!posts) throw Error;
//posts);

    return posts;
  } catch (error) {
    //error);
  }
 }


 getInfiniteUser=async({pageParam}: { pageParam: number })=>{
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(6)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    let user = await this.database.listDocuments(
      conf.DATABASE_ID,
      conf.USER,
      queries
    );

    if (!user) throw Error;
//user);

    return user;
  } catch (error) {
    //error);
  }
 }

 getInfiniteUserResult=async({pageParam,id}: { pageParam: number, id:string })=>{
  const queries: any[] = [ Query.limit(6),Query.search('userName', id),Query.offset(0)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    //id);
    
    let posts = await this.database.listDocuments(
      conf.DATABASE_ID,
      conf.USER,
      queries
    );

    if (!posts) throw Error;
//posts);

    return posts;
  } catch (error) {
    //error);
  }
 }
 getInfinitePostsOfUserOnly=async({pageParam,id}: { pageParam: number,id:string })=>{
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(6),Query.equal('creator',id)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    let posts = await this.database.listDocuments(
      conf.DATABASE_ID,
      conf.POSTS,
      queries
    );

    if (!posts) throw Error;
//posts);

    return posts;
  } catch (error) {
    //error);
  }
 }

 async getUserById(id:string){
      try {
       let userdetail = await this.database.getDocument(
          conf.DATABASE_ID,
          conf.USER,
          id
        )
        //userdetail);
        
        return userdetail
      } catch (error) {
        //error);
        
      }
 }

 async updateUser({id,name,userName,email,bio}){
   try {
   let updateProfile = await this.database.updateDocument(
      conf.DATABASE_ID,
      conf.USER,
      id,{
        name:name,
        
        bio:bio
      }
    )
    if(!updateProfile)throw Error
    return updateProfile
   } catch (error) {
    //error);
    
   }

  
 }
 async updateProfilePic(file,id){
      try {
        //file);
        
       let uploadFile = await this.storage.createFile(conf.BUCKET_ID,ID.unique(),file)

       if(uploadFile){
      let preview = await  this.getFilePreview(uploadFile?.$id,10)
          return await this.database.updateDocument(
              conf.DATABASE_ID,
              conf.USER,
              id,
             { imageUrl:preview}
            )
       }
       


      } catch (error) {
        //error);
        
      }
 }
}

let authservice = new Auth();
export default  authservice