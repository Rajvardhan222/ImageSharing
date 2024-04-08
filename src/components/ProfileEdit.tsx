import { useUserContext } from '@/context/AuthContext'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
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
import { formss } from "@/lib";
import authservice from '@/lib/appwrite/user';
function ProfileEdit() {
    let {id} = useParams()
    let {user} = useUserContext()
    let [showDialog,setShowDialog] = useState(false)
    const form = useForm<z.infer<typeof formss>>({
        resolver: zodResolver(formss),
        defaultValues: {
        
          file: [],
        
        },
      });
      async function onSubmit(values: z.infer<typeof formss>) {
            console.log({values});
            if(fileUrl){
              let updatePic = await  authservice.updateProfilePic(values.file[0],id)
              if(updatePic)setShowDialog(false)
            }

      }
      const [fileUrl, setFileUrl] = useState('')
  return(
    showDialog ? <>
    <div className='md:w-2/4 md:h-[30rem] md:min-h-[30rem] min-h-[40rem]  bg-slate-900 rounded-2xl fixed  md:top-[20%] md:left-[30%] z-50 border-white flex p-7 items-center gap-7 md:flex-row md:flex flex-col w-[90%] m-auto top-[0%] background'>
        
        <img src={fileUrl||user.imageUrl} className='rounded-full w-48 h-48'>
        </img>
        <Form {...form}>
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
         <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Update Profile</FormLabel>
              <FormControl>
                <FileUpload fieldChange={field.onChange} fileUrl={fileUrl} setFileUrl={setFileUrl}/>
              </FormControl>
              
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
         <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
           
          >
       Update Profile
          </Button>
      </form>
        </Form>
    </div>
    <div>
   
    </div>
    </> : <>
      <p className='font-semibold text-lg text-[#0095F6] cursor-pointer ' onClick={()=>setShowDialog(!showDialog)}>Change Profile Photo</p> 
    </>
  )
}

export default ProfileEdit