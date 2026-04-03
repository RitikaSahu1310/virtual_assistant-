import React, { useContext, useState } from 'react'
import UserContext, { userdataContext } from '../context/userContext'
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserdata}=useContext(userdataContext)
    const [assistantName,setAssistantName]=useState(userData?.assistantName||"")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

    const handleUpdateAssistant= async ()=>{
        setLoading(true)
        try {
            let formData= new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage){
                formData.append("assistantImage",backendImage)
            }else{
                formData.append("imageUrl",selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
            setLoading(false)
            console.log(result.data)
            setUserdata(result.data)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
        <IoMdArrowRoundBack className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/customize")}/>
     <h1 className='text-white mb-[30px] text-[30px] text-center'>Enter Your <span className='text-blue-200'>Assistant Name</span></h1>
     <input
            type="text"
            placeholder="eg.Sophie"
            className="w-full max-w-[600px] h-[55px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-6 rounded-full text-[16px]"
          required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
          {assistantName && <button
         className="mt-8 min-w-[300px] h-[60px] text-black font-semibold cursor-pointer bg-white rounded-full text-[18px] flex items-center justify-center mx-auto hover:bg-gray-200 transition" disabled={loading}
         onClick={() =>{ 
            handleUpdateAssistant()
            }
                   }>{!loading? "Finally Create Your Assistant":"Loading..."}
    </button>}
    
    </div>
  )
}

export default Customize2