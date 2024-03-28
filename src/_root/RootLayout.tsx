import { useUserContext } from "@/context/AuthContext";
import { useGetCurrentUser } from "@/lib/react-query/queriesandMutations";
import BottomBar from "@/shared/BottomBar";
import LeftSideBar from "@/shared/LeftSideBar";
import TopBar from "@/shared/TopBar";
import { Loader2, Loader2Icon } from "lucide-react";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function RootLayout() {
  let navigate = useNavigate();
  const { data: user, isPending: loadingUser } = useGetCurrentUser();

  useEffect(() => {
    if (!user && !loadingUser) {
      navigate("/sign-in");
    }
  }, [navigate]);
  if (loadingUser) {
    return (
      <div className="w-full flex justify-center items-center">
        <Loader2Icon size={80} strokeWidth={3} className=" animate-spin stroke-dash-custom"/>
      </div>
    );
  } else {
    
    return (
      <div className="w-full md:flex">
        <TopBar />
        <LeftSideBar />
        <section className="flex flex-1 h-full">
          <Outlet />
        </section>

        <BottomBar />
      </div>
    );
  }
}

export default RootLayout;
