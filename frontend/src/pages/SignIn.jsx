import React, { useContext, useState } from "react";
import bg from "../assets/authBg.jpeg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { userdataContext } from "../context/userContext";
import axios from "axios";


function SignIn() {
  const [showPassword, setShowPassword]=useState(false)
  const {serverUrl,userData, setUserdata} = useContext(userdataContext)
  const navigate = useNavigate()
  const [email,setEmail]=useState("")
  const [loading,setLoading]= useState(false)
  const [password,setPassword]=useState("")
  const [err,setErr] =useState("")

  const handleSignIn=async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signin`,{
       email,password
      },{withCredentials:true})
      localStorage.setItem("token", result.data.token)
      setUserdata(result.data)
      navigate("/customize")
      setLoading(false)
    } catch (error) {
      console.log(error)
      setUserdata(null)
       setLoading(false)
       navigate("/")
      setErr(error.response.data.message)
    }
  }

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="w-[90%] h-[450px] max-w-[450px] bg-[#00000066] backdrop-blur-md shadow-xl shadow-black p-10 rounded-lg flex flex-col items-center" onSubmit={handleSignIn}>

        <h2 className="text-white text-[28px] font-semibold mb-8 text-center">
          Sign In to <span className="text-blue-400">Virtual Assistant</span>
        </h2>

        {/* inputs wrapper */}
        <div className="w-full flex flex-col gap-5">

          <input
            type="email"
            placeholder="Email"
            className="w-full h-[55px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-6 rounded-full text-[16px]"
          required onChange={(e)=>setEmail(e.target.value)} value={email}
          />
         <div className="w-full h-[55px] border-2 border-white bg-transparent text-white rounded-full text-[16px] relative">
           <input type={showPassword?"text":"password"}
            placeholder="Password"
            className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-6 text-[16px]'
             required onChange={(e)=>setPassword(e.target.value)} value={password}/>
           
        {!showPassword &&  <FaEye  className="absolute top-[18px] right-[20px] w-[20px] h-[20px] text-[white] cursor-pointer" onClick={()=>setShowPassword(true)}/>}
        {showPassword &&  <FaEyeSlash className="absolute top-[18px] right-[20px] w-[20px] h-[20px] text-[white] cursor-pointer " onClick={()=>setShowPassword(false)}/>}
        
         </div>
       </div>
       {err.length>0 && <p className="text-red-500  text-sm mt-2">
        *{err}
        </p>}
        <button className="mt-8 min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-full text-[18px] hover:bg-gray-200 transition" disabled={loading}>{loading? "Loading...":"Sign In"}</button>
      <p className="text-[white] text-[18px] cursor-pointer " onClick={()=>navigate("/signup")}>Want to Create a New Account ? <span className="text-blue-400">Sign Up</span></p>
      </form>
    </div>
  );
}

export default SignIn;