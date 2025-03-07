import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navbarRef = useRef(null);

  useEffect(() => {
    gsap.to(navbarRef.current, {
      y: -100,
      ease: "power2.out",
      duration: 0.1,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        toggleActions: "play none reverse none",
        scrub: true,
      },
      
    });
  }, []);

  return (
    <div
      ref={navbarRef}
      id="navbar"
      className="fixed text-white top-0 flex items-center justify-between mt-2 p-5 bg-transparent rounded-xl w-full z-10 transition-all duration-300"
    >
      <div id="head">
        <h1 className="font-bold text-2xl">Recipe Mate</h1>
      </div>

      <div id="themes" className="flex justify-around items-center gap-5 text-lg">
        <a href="#" className="hover:underline">Home</a>
        <a href="#search" className="hover:underline">Search</a>
        {/* <button className="px-4 py-2 text-white rounded-lg hover:bg-gray-700 transition">Download App</button> */}
      </div>
    </div>
  );
};

export default Navbar;