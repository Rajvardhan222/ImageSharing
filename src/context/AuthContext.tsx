import authservice from '@/lib/appwrite/user'
import { IUser } from '@/types'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { createContext,useContext,useEffect,useState } from 'react'

export const InitialUser = {
    id : '',
    name : '',
    email : '',
    password : '',
    username : '',
    imageUrl : '',
    bio : ''
}

const Initial_State = {
    user : InitialUser,
    isLoading : false,
    isAuthenticated : false,
    setUser : () => {},
    setLoading : () => {},
    setAuthenticated : () => {},
    checkAuthUser : () => false as boolean
}

const AuthContext = createContext(Initial_State)
function AuthProvider({children}: {children : React.ReactNode}) {
    let [user,setUser] = useState<IUser>(InitialUser)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
     const [isAuthenticated, setIsAuthenticated] = useState(false)
let checkAuthUser =async  () =>{



    try {
        let currentUser = await authservice.getCurrentUser()

        if(currentUser){
            setUser({
                id : currentUser.$id,
                name : currentUser.name,
                email : currentUser.email,
               
                username : currentUser.userName,
                imageUrl : currentUser.imageUrl,
                bio : currentUser.bio
            })
            setIsAuthenticated(true)

            return true
        }
        return false
    } catch (error) {
        console.log(error);
        
    }
}
     const value = {
         user,
         setUser,
         loading,
         
         isAuthenticated,
         setIsAuthenticated,
         checkAuthUser : checkAuthUser
     }
    //  || localStorage.getItem('cookieFallback') === null
     useEffect(() => {
         if(localStorage.getItem('cookieFallback') === '[]'|| localStorage.getItem('cookieFallback') === null ) navigate("/sign-in")

         checkAuthUser()
     }, [])
  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}
export const useUserContext = () => useContext(AuthContext) 
export default AuthProvider;