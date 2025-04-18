import React from 'react'
import githublogo from '../assets/github.svg';
import linkedinlogo from '../assets/linkedin.svg';

const Login = () => {
  return (
    <>
      <div class="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <nav className="flex justify-end bg-transparent text-white w-full p-5 pr-52">
        <a href="https://www.linkedin.com/in/bhargava-krishna-adapala">

          <button class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-transparent px-6 font-medium text-neutral-200 duration-500"><div class="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">Linked In</div><div class="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"><img src={linkedinlogo} alt="" /></div></button>
        </a>
        <a href="https://github.com/AdapalaBhargavaKrishna/Web-Development/MovieShelf">

          <button class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-transparent px-6 font-medium text-neutral-200 duration-500"><div class="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">Github</div><div class="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"><img src={githublogo} alt="" /></div></button>
        </a>
      </nav>


    </>
  )
}

export default Login
