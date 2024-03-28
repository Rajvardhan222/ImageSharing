import conf from "@/conf/conf";
import { INewPost, INewUser, IUpdatePost, IUser } from "@/types";
import { Client,Account,Databases,Storage,Avatars, ID, Query } from "appwrite";


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
            console.log(error.message);
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
              console.log(error);
              
            }


        }

        async singIn(user : {email:string; password:string; }){
          try {
            return await this.account.createEmailSession(user.email, user.password)
          } catch (error) {
            console.log(error);
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
            console.log(error);
            
          }
         }

          singout=async()=>{
          try {
            return await this.account.deleteSession('current')
          } catch (error) {
            console.log(error);
            throw error.message
          }
         }

         async createPost(post :INewPost){
          try {
            const uploadedFile = await this.uploadFile(post.file[0])
              if(!uploadedFile) throw Error

              const fileUrl = await this.getFilePreview(uploadedFile.$id)
              console.log(fileUrl);
              

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
                    console.log(post.userId);
                    
                if(!newPost){
                  await this.deleteFile(uploadedFile.$id)
                  throw Error
                }

                return newPost

          } catch (error) {
            console.log(error);
            
          }
         }

         async deleteFile(id:string) {
          try {
            await this.storage.deleteFile(conf.BUCKET_ID, id)
            return {status : 'OK'}
          } catch (error) {
            console.log(error);
            
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
            console.log(error);
            
          }
         }

          getFilePreview(fileId : string){
          try {
            const fileUrl =  this.storage.getFilePreview(conf.BUCKET_ID,
              fileId,
              2000,2000,'top',10
              )
              return fileUrl
          } catch (error) {
            console.log(error);
            
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
              console.log(posts);
              
              return posts
          } catch (error) {
            console.log(error);
            
          }
         }

         async likePost (postId:string,likesArray:string){
              try {
                console.log(likesArray);
                
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
                // console.log(error);
                
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
            console.log(error);
            
          }
     }


     async deleteSavePost (savedRecordId:string){
      try {
        const statusCode = await this.database.deleteDocument(
          conf.DATABASE_ID,
          conf.SAVES,
          savedRecordId
        )
        if(!statusCode) throw Error
        return statusCode
       
      } catch (error) {
        console.log(error);
        
      }
 }

 async getPostbyId(postId:string){
      try {
        let post = await this.database.getDocument(conf.DATABASE_ID,
          conf.POSTS,
          postId
        )
        console.log(post);
        
        return post;
      } catch (error) {
        console.log(error);
        
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
        console.log(fileUrl);
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
    console.log(error);
    
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
    console.log(error);
    
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
    console.log(error);
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
console.log(posts);

    return posts;
  } catch (error) {
    console.log(error);
  }
 }
}

let authservice = new Auth();
export default  authservice