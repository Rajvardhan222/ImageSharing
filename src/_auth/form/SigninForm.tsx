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
  
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinSchema } from "@/lib";
import Loader from "@/shared/Loader";

import {  useSignInUserAccountMutation } from "@/lib/react-query/queriesandMutations";
import { useUserContext } from "@/context/AuthContext";

function Signinform() {
  let [isLoading,setIsLoading] = useState(true)
  const { toast } = useToast()
  let {checkAuthUser,isLoading:isUserLoading} =  useUserContext()

  

  let {mutateAsync : SigninUser,isPending:isSigningUser,error} = useSignInUserAccountMutation()
  // 1. Define your form.
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
    
      email: "",
      password: "",
    },
  });
    let navigate = useNavigate()
  // 2. Define a submit handler.
  async function  onSubmit(values: z.infer<typeof signinSchema>) {
        

          let session = await SigninUser({email: values.email, password: values.password})

          if(!session){
            return toast({
              title: "Login failed"
            })
          }
          const isLoggedIn = await checkAuthUser()
          console.log(isLoggedIn );
          
          if(isLoggedIn){
            form.reset()
            navigate('/')
          }
          else{
            return toast({
              title: "Loggin failed"
            })
          }
   
  }
  return (

    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col w-[90%]">
        <img src="/assets/images/logo.svg"></img>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          LogIn to account
        </h2>
        <p className="text-light-3 small-medium md:base-regular">
          welcome back login to your account
        </p>
        {error && <p className="text-red max-w-[95%] md:max-w-full text-center">{error.message}</p>}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-5 w-full mt-4"
        >
         

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
            isSigningUser? (<Loader/>) : "Sign Up"
          }</Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Dont have an account with us?{" "}
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">create Account</Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default Signinform;
