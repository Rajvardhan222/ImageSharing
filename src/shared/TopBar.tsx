import { Button } from '@/components/ui/button'
import { useUserContext } from '@/context/AuthContext'
import { useSignOutUserAccountMutation } from '@/lib/react-query/queriesandMutations'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function TopBar() {
    let {mutate:signout,isSuccess} = useSignOutUserAccountMutation()
    let navigate = useNavigate()
useEffect(() => {
        if(isSuccess){
            navigate(0)
        }

}, [isSuccess])

    let {user} = useUserContext()
  return (
    <section className='topbar'>
        <div className='flex-between py-4 px-5'>
            <Link to={'/'} className={'flex gap-3 items-center'}>
                <img src='/assets/images/logo.svg'
                width={130}
                height={325}
                ></img>
            </Link>

            <div className=' flex gap-4'>
                <Button variant={'ghost'} className='shad-button_ghost' onClick={()=> signout()}>
                    <img src='/assets/icons/logout.svg'></img>
                </Button>

                <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
                <img src={user.imageUrl || "/assets/images/profile-placeholder.svg"} className='h-8 w-8 rounded-full'></img>
                </Link>

            </div>
        </div>

    </section>
  )
}

export default TopBar