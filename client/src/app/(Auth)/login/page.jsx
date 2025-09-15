"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function page() {
  const router = useRouter();
  const [SubmitDisable, setSubmitDisable] = useState(false);
  const [error, setError] = useState("");
  function handleSubmit(e) {
    setSubmitDisable(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    axios
      .post(
        "auth/user/login",
        {
          ...data,
          loginType: "self",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.status) {
          router.push("/");
        } else {
          setError(res.data.status);
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.error(err);
      });

    setSubmitDisable(false);
  }

  return (
    <section className="h-screen w-full flex flex-col justify-center items-center">
      <div className="py-4">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Welcome Let's Enter Your World !
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="border border-black/30 p-6 flex flex-col gap-6 w-full md:w-1/2 rounded-2xl shadow-xl focus-within:shadow-2xl"
      >
        <input
          name="email"
          className="p-3 rounded-lg border-1 focus:outline-2 placeholder:font-medium focus:outline-gray-400 outline-0 transition-all ease-in-out duration-75"
          type="email"
          placeholder="Email"
          required
        />
        <input
          name="password"
          className="p-3 rounded-lg border-1 focus:outline-2 placeholder:font-medium focus:outline-gray-400 outline-0 transition-all ease-in-out duration-75"
          type="password"
          placeholder="Password"
          required
        />
        <input
          disabled={SubmitDisable}
          className=" hover:bg-black/80 transition-all ease-in duration-100 w-2/6 self-center p-2 border border-black/30 rounded-lg bg-black text-white text-balance tracking-wide font-semibold"
          type="submit"
          value={"Let's Go"}
        />
        <div>
          <Link
            href={"/signup"}
            className="text-blue-400 transition-all ease-linear duration-100 hover:text-blue-600 hover:underline hover:underline-offset-4  font-mono"
          >
            Let's Register an Account ?
          </Link>
          <p className="font-sans text-red-500 animate-pulse underline underline-offset-4">
            {error}
          </p>
        </div>
      </form>
    </section>
  );
}

export default page;
