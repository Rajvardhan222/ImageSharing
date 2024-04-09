import { z } from "../../lib/index";
import { zodResolver } from "@hookform/resolvers/zod";
import  { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"

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

import { useCreateUserAccountMutation, useSignInUserAccountMutation } from "@/lib/react-query/queriesandMutations";
import { useUserContext } from "@/context/AuthContext";
import authservice from "@/lib/appwrite/user";


function Signupform() {
  let [isLoading,setIsLoading] = useState(true)
  const { toast } = useToast()
  let {checkAuthUser,isLoading:isUserLoading} =  useUserContext()

  let {mutateAsync : createNewUserAccount,isPending:isCreatingUser,error} = useCreateUserAccountMutation()

  let {mutateAsync : SigninUser,isPending:isSigningUser} = useSignInUserAccountMutation()
  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
    let navigate = useNavigate()
    let [errorss,setError] = useState('')
  // 2. Define a submit handler.
  async function  onSubmit(values: z.infer<typeof signUpSchema>) {
      setError('')
           let isthere = await authservice.isUserThere(values.username)
           console.log(isthere);
           
           if(isthere?.total === 0){
            let newUser = await createNewUserAccount(values)
            console.log(error);
            console.log('creating User...');
            
          if(!newUser){

           return toast({
              title: "Account creation failed . Please try again"
            })
          }

          let session = await SigninUser({email: values.email, password: values.password})

          if(!session){
            return toast({
              title: "Account creation failed during loging in. Please try again "
            })
          }
          const isLoggedIn = await checkAuthUser()
          if(isLoggedIn){
            form.reset()
            navigate('/')
          }
          else{
            return toast({
              title: "Account creation failed during loging in. Please try again "
            })}
          }else{
            setError('A User with Same UserName is Already regestered')
            return toast({
              title: "A User With ID Already Exist "
            })
          }
          
        
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col max-w-[90%]">
        <img src="/assets/images/logo.svg"></img>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a New Account
        </h2>
        <p className="text-light-3 small-medium md:base-regular">
          TO use smapgram enter your detail
        </p>
        {error && <p className="text-red max-w-[95%] md:max-w-full text-center">{error}</p>
        }
         {errorss.length>0 && <p className="text-red max-w-[95%] md:max-w-full text-center">{errorss}</p>}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-5 w-full mt-4"
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
                  <Input type="text" className="shad-input" {...field} />
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
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
               
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">{
            isCreatingUser? (<Loader/>) : "Sign Up"
          }</Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Login</Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default Signupform;
