import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import FileUpload from "./FileUpload";
import { postValidation } from "@/lib";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesandMutations";
import authservice from "@/lib/appwrite/user";

function FormPost({ post,action }) {
    let navigate = useNavigate()
    const {toast} = useToast()
    const {user} = useUserContext()
  // 1. Define your form.
        const {mutateAsync : createPost , isPending:isLoadingCreate} = useCreatePost()
        const{mutateAsync:updatePost , isPending:isLoadingUpdate} = useUpdatePost()

  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
    },
  });

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof postValidation>) {
  if(post){
   let updatePostdata = await updatePost({...values,postId:post.$id,
  imageId: post?.imageId,
  imageUrl: post?.imageUrl

  });

   if (!updatePostdata) {
    return (
        toast({
            title :'Update Failed'
        })
    )
}
navigate('/')
  } else{
     const newPost = await createPost({...values,
    userId:user.id
    });
    if (!newPost) {
        return (
          
            toast({
                title :'Please try again'
            })
        )
    }
    navigate('/')
  }}
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">File upload</FormLabel>
              <FormControl>
                <FileUpload fieldChange={field.onChange} mediaUrl={post?.imageURl}/>
              </FormControl>
              
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label ">Add Location</FormLabel>
              <FormControl>
                <input type="text" className="shad-input" {...field}></input>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add tags (seprated by commas)
              </FormLabel>
              <FormControl>
                <input
                  type="text"
                  className="shad-input"
                  placeholder="html,css,js"
                  {...field}
                ></input>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className={`flex gap-4 items-center justify-end `}>
          <Button type="button" className={`shad-button_dark_4 ${isLoadingCreate || isLoadingUpdate ? "shad-button_dark_4_loading" :""}`}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {post ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FormPost;
