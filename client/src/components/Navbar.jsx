"use client";
import { CheckAuth } from "@/Store/Auth/AuthSlicer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cart from "./Cart";

function Navbar() {
  const [isCartOpen,setIsCartOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const isAuth = useSelector((state) => state.Auth);
  // console.log(isAuth);
  const cartCount = useState(() => {
    let c = 12;
    return Math.round(c / 10) * 10 + "+";
  });
  const links = [
    { name: "Home", link: "/" },
    { name: "Store", link: "/store" },
    { name: "Keyboard", link: "/keyboard" },
    { name: "Keys", link: "/keycaps" },
    { name: "Launch", link: "/launch" },
    { name: "Contact", link: "/contact" },
  ];
  const pathname = usePathname();
  // console.log(isAuth)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CheckAuth());
  }, [pathname]);

  return (
    <nav className="bg-black/90 p-2 flex justify-between md:justify-center items-center gap-10">
      <div className="text-white/80 text-lg px-3 md:p-0">
        <i className="fa-solid fa-keyboard"></i>
      </div>
      <div className="hidden md:flex gap-10 items-center">
        {links.map((link, index) => {
          return (
            <Link
              className="text-white/80 text-sm p-0.5 font-semibold"
              key={index}
              href={link.link}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex ">
        {isAuth.status && (
          <div className="self-end">
            <button
              onClick={()=>{
                setIsOpen(false)
                setIsCartOpen(true)
              }}
            >
              <i className="text-white fa-solid fa-cart-shopping"></i>
              <sup>
                <span className="text-orange-500">{cartCount}</span>
              </sup>
            </button>
          </div>
        )}
        <div className="px-3 block md:hidden">
          <button
            onClick={() => {
                setIsCartOpen(false)
              setIsOpen(true);
            }}
          >
            <i className="text-white  text-lg  fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
      <div
        className={`px-4 fixed top-0 flex flex-col h-screen w-full bg-black md:hidden z-50 transition-all ease-linear duration-200 ${
          !isOpen ? "-translate-x-full" : "translate-x-0"
        } `}
      >
        <div className="flex justify-end items-center p-4">
          <button
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <i className="text-white text-lg fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="flex flex-col gap-y-5 ">
          {links.map((link, index) => {
            return (
              <Link
                className="text-white/80 text-3xl font-extrabold flex px-1 justify-between items-center"
                key={index}
                href={link.link}
              >
                {link.name}
                <i className="text-blue-400/80 fa-solid fa-angle-down"></i>
              </Link>
            );
          })}
          {!isAuth.status && (
            <div className="flex gap-6">
              <Link
                className="  text-blue-400 hover:underline underline-offset-4 font-semibold tracking-tight"
                href={"/login"}
              >
                Login
              </Link>
              <Link
                className="  text-blue-400 hover:underline underline-offset-4 font-semibold tracking-tight"
                href={"/signup"}
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
      {!isAuth.status && (
        <div className="hidden md:flex gap-6">
          <Link
            className="  text-blue-400 hover:underline underline-offset-4 font-semibold tracking-tight"
            href={"/login"}
          >
            Login
          </Link>
          <Link
            className="  text-blue-400 hover:underline underline-offset-4 font-semibold tracking-tight"
            href={"/signup"}
          >
            Signup
          </Link>
        </div>
      )}
      <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}  />
    </nav>
  );
}

export default Navbar;
