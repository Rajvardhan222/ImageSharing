import { useGetUserById } from '@/lib/react-query/queriesandMutations';
import React from 'react'
import { profileUpdateSchema, z } from "../../lib/index";
import { useParams } from 'react-router-dom'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib";
import Loader from "@/shared/Loader";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import authservice from '@/lib/appwrite/user';
import ProfileEdit from '@/components/ProfileEdit';
function UpdateProfile() {
  let {id} = useParams()
  let { data: uniqueUser } = useGetUserById(id);

  const form = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: uniqueUser?.name,
      username: uniqueUser?.userName,
      email: uniqueUser?.email,
      bio: uniqueUser?.bio,
    },
  });

  async function  onSubmit(values: z.infer<typeof profileUpdateSchema>) {
       //values);
      let updateProfile = await authservice.updateUser({...values,id})
      //updateProfile);
      
   
  }
  return (
    <div className='w-full overflow-scroll md:ml-6'>
      
      <div className='flex flex-col gap-y-7'>
        <div className='flex gap-x-7 mt-10 w-full'>
          <img src='/assets/icons/editProfile.svg' className=' w-8 '>
          </img>
          <h1 className='text-4xl font-bold'>
           Edit Profile
          </h1>
        </div>
        <div className='flex items-center gap-4 ml-3'>
          <img src={uniqueUser?.imageUrl} className='w-32 rounded-full '>
          </img>
         
           <ProfileEdit/>
          
        </div>
        <div>
          <Form {...form}>
          <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-5 w-[90%] m-auto mt-4"
        >
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} disabled={true}/>
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} disabled={true} />
                </FormControl>
               
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} required={false} />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary w-36 flex-end">{
          "Update Profile"
          }</Button>

        </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile