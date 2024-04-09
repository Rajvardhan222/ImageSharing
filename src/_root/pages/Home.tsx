import { useGetRecentPosts } from '@/lib/react-query/queriesandMutations';
import Loader from '@/shared/Loader';

import PostCard from './PostCard';
import { Loader2Icon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

function Home() {
  const { isAuthenticated } = useUserContext();
let navigate = useNavigate();
  const { ref, inView } = useInView({
    rootMargin:"6000px 0px 0px 0px" ,
    threshold:0,
  });
  const {data:posts,isPending:isPostLoading,isError:isPostError,hasNextPage,fetchNextPage} = useGetRecentPosts()
  //posts);
  useEffect(() => {
    if (inView ) {
      fetchNextPage();
     
      
    }
  }, [inView]);
  useEffect(()=>{
    if(!isAuthenticated){
      navigate('/sign-in')
    }
  },[navigate])
  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [fetchNextPage]);
  // const handleScroll = () => {
  //   const scrollY = window.scrollY;
  //   const windowHeight = window.innerHeight;
  //   const documentHeight = document.documentElement.scrollHeight;
  //   if (scrollY + windowHeight >= documentHeight - 3000) {
  //     fetchNextPage();
  //   }
  // };
  return (
  <div className="flex flex-1">
  <div className="home-container">
  <div className="home-posts">
  <h2 className="h3-bold md:h2-bold text-left w-full">Home
  Feed</h2>
  {isPostLoading && !posts ? (
  <Loader />
  ):(
  <ul className='flex flex-col gap-9 flex-1 w-full '>
    {
      posts?.pages.map((item,index)=>(

          item?.documents.map(post => <PostCard post={post}/>)
     
          
      ))
    }
  </ul>
  )}
  
    {hasNextPage && (
      <div  className="mt-10" ref={ref}>
       <Loader2Icon className="animate-spin"/>
      </div>
    )}
  
  </div>
  </div>
  </div>)
}

export default Home