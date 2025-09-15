import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="h-screen w-full bg-white/50 flex justify-center items-center">
      <h2 className="capitalize scroll-m-20  text-3xl font-semibold tracking-tight first:mt-0 text-center">
        may be your world is limited Let's go to other page <br />
        <Link
          className="text-center underline underline-offset-4 text-blue-400 text-lg"
          href={"/"}
        >
          Click here
        </Link>
      </h2>
    </div>
  );
}

export default page;
