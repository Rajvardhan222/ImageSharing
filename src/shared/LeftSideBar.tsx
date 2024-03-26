import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutUserAccountMutation } from "@/lib/react-query/queriesandMutations";
import React, { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function LeftSideBar() {
  let { pathname } = useLocation();

  let { mutate: signout, isSuccess } = useSignOutUserAccountMutation();
  let navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      navigate('/sign-in');
    }
  }, [isSuccess]);

  let { user } = useUserContext();
  console.log(user);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to={"/"} className={"flex gap-3 items-center"}>
          <img src="/assets/images/logo.svg" width={160} height={36}></img>
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/images/profile-placeholder.svg"}
            className="w-14 h-14 rounded-full "
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link) => {
            let isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive ? "bg-primary-500" : null
                }`}
              >
                <NavLink
                  to={link.route}
                  className={"flex gap-4 items-center p-4"}
                >
                  <img
                    src={link.imgURL}
                    className={`group-hover:invert-white ${
                      isActive ? "invert-white" : null
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant={"ghost"}
        className="shad-button_ghost hover:border-red  hover:border-2"
        onClick={() => signout()}
      >
        <img src="/assets/icons/logout.svg"></img>
       <p className="small-medium lg:base-medium">logout</p>
      </Button>
    </nav>
  );
}

export default LeftSideBar;
