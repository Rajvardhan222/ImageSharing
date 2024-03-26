import { bottombarLinks, sidebarLinks } from "@/constants";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function BottomBar() {
  let { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        let isActive = pathname === link.route;
        return (
          <li
          
            className={` group ${
              isActive ? "bg-primary-500 rounded-sm flex-center" : null
            }`}
          >
            <Link to={link.route} className={` ${
              isActive ? "bg-primary-500 rounded-[10px] flex-center flex-col gap-1 p-2 transition duration-200" :'flex-center flex-col'
            }`}>
              <img
                src={link.imgURL}
                width={16}
                height={16}
                className={`group-hover:invert-white ${
                  isActive ? "invert-white" : null
                }`}
              />
              <p className="tiny-medium text-light-2">{link.label}</p>
            </Link>
          </li>
        );
      })}
    </section>
  );
}

export default BottomBar;
