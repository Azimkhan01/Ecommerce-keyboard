import HomeAnnouncement from "@/components/HomeAnnouncement";
import Image from "next/image";
import React from "react";

function page() {
  return (
    <>
      <HeroSection />
      <div className=" w-full h-auto hidden lg:flex max-h-screen  flex-col p-4">
        {Array.from({ length: 3 }).map((_, i) => {
          return (
            <div key={i} className="flex justify-between w-full">
              <p className="uppercase text-5xl md:text-6xl lg:text-9xl z-[0] font-bold text-center tracking-tigher bg-gradient-to-r from-[#77A1D3] via-[#79CBCA] to-[#E684AE] bg-clip-text text-transparent">
                Some
              </p>
              <p className="uppercase text-5xl md:text-6xl lg:text-9xl z-[0] font-bold text-center tracking-tigher bg-gradient-to-r from-[#77A1D3] via-[#79CBCA] to-[#E684AE] bg-clip-text text-transparent">
                Thing
              </p>
            </div>
          );
        })}
      </div>
      <Page2 />
      <Page3 />
    </>
  );
}

export default page;

function HeroSection() {
  return (
    <main className="w-full overflow-y-hidden md:overflow-visible  max-h-screen bg-black">
      <HomeAnnouncement />
      <div className="">
        <div className="py-10">
          <h1 className="scroll-m-20 text-center text-5xl font-extrabold tracking-tight text-balance text-white">
            Jadestone Keyboard
          </h1>
          <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight text-balance text-white pt-2">
            RGB 60% Out.
          </h2>
          <h3 className="scroll-m-20 text-center text-2xl font-medium tracking-tight text-balance text-white/50 p-1">
            Available Now.
          </h3>
          <div className="w-full flex justify-center items-center p-4 gap-6 ">
            <button className="border py-3 px-6 rounded-full text-blue-500 hover:bg-blue-400 hover:text-white transition-all ease-linear duration-75 border-blue-400">
              Learn More
            </button>
            <button className="border py-3 px-6 rounded-full text-blue-500 hover:bg-blue-400 hover:text-white transition-all ease-linear duration-75 border-blue-400">
              Pre-order
            </button>
          </div>
        </div>
        <div className="relative z-10 flex justify-center items-center">
          <img
            className=" w-full md:w-5/8"
            alt="hero image"
            // className=''
            // width={300}
            // height={600}
            src={"/home/heroimage.png"}
          />
        </div>
      </div>
    </main>
  );
}

function Page2() {
  return (
    <section className="min-h-screen w-full bg-white p-4 md:p-0">
      <div className="py-4 md:py-20">
        <h2 className="uppercase scroll-m-20 text-center text-5xl font-extrabold tracking-tight text-balance bg-gradient-to-r from-[#9796f0] to-[#fbc7d4] bg-clip-text text-transparent">
          Spider Web Keyboard
        </h2>
        <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight text-balance bg-gradient-to-r from-[#acb6e5] to-[#86fde8] bg-clip-text text-transparent">
          Multiple transformation
        </h2>
        <h2 className=" scroll-m-20 text-center text-3xl font-semibold tracking-tight text-balance bg-gradient-to-r from-[#acb6e5] to-[#86fde8] bg-clip-text text-transparent">
          {" "}
          Finnest 60% ever.
        </h2>
        <h2 className=" scroll-m-20 text-center text-2xl font-semibold tracking-tight text-balance bg-gradient-to-r from-white/80 to-black/80 bg-clip-text text-transparent">
          Available Now.
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
        
          <div className="p-2 bg-gradient-to-tr from-amber-200 to-amber-400 rounded-2xl">
            <Image
          width={600}
          height={600}
          className="rounded-2xl "
          src={'/home/spiderweb.jpg'}
          alt="spider web keyboard"
        />
          </div>
        <div className="p-2 bg-gradient-to-tr from-amber-200 to-amber-400 rounded-2xl">
          <Image
          width={600}
          height={600}
          className="rounded-2xl "
          src={'/home/spiderweb2.png'}
          alt="spider web keyboard"
        />
        </div>
        
      </div>

    </section>
  );
}

function Page3()
{
  return(
    <section className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 w-full gap-4 p-4">
      {
        [
          {heading:"Green Jelly HOA",src:"/home/key-2.jpg"},
          {heading:"Doubleshot PBT",src:"/home/key-3.webp"},
          {heading:"SPY FAMILY Cherry",src:"/home/key-4.png"},
          {heading:"Japanese Anime Theme",src:"/home/key-5.png"}
        ].map((item,key)=>{
          return <div key={key}>
          <div className="">
            
            <h2 className="text-4xl font-extrabold tracking-tight text-center text-balance w-full bg-white p-4 underline underline-offset-4 decoration-amber-300" >{item.heading}</h2>
           
          </div>
          <div>
            <Image
              width={1000}
              height={1000}
              src={item.src}
              alt="keyboard 2"
            />
          </div>
      </div>
        })
         
      }
    </section>
  )

}

