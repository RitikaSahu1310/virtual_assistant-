// import axios from "axios"
// import React, { createContext, useEffect,useState } from "react";
// export const userDataContext = createContext()

// function UserContext({children}) {
//     const serverUrl = "http://localhost:8000"
//     const [userData,setUserData] =useState(null)
     
//     const handleCurrentUser=async()=>{
//       try {
//         const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
//         setUserData(result.data)
//         console.log(result.data)
//       } catch (error) {
//         console.log(error)
//       }
//     }

//     useEffect(()=>{
//       handleCurrentUser()
//     },[])
//     const value = {
//                 serverUrl
//     }
//   return (
//    <div>
//     <userDataContext.Provider value= {value}>
//         {children}
//     </userDataContext.Provider>
         
//    </div>
//   )
// }

// export default UserContext


import { createContext, useEffect, useState } from "react"
import axios from "axios"

const userdataContext = createContext()

function UserContext({ children }) {

  const serverUrl = "http://localhost:8000"
  const [userData, setUserdata] = useState(null)
  const [frontendImage,setFrontendImage]=useState(null)
  const [backendImage,setBackendImage]=useState(null)
  const [selectedImage,setSelectedImage] =useState(null)

   const [loading,setLoading]= useState(true)
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true
      })
       console.log("Api success:",result.data) 
      setUserdata(result.data)
    } catch (error) {
      console.log("API Error:", error.response?.status, error.response?.data)
    }finally{
      setLoading(false)
    }
  }

//   const getGeminiresponse = async (command)=>{
// try {
//   const result = await axios.post (`${serverUrl}/api/user/asktoassistant`,{command:command},{withCredentials:true})
//   return result.data
// } catch (error) {
//   console.log("gemini api error:", error.response?.data)
//   return null
// }
//   }
const getGeminiresponse = async (command) => {
  try {
    const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, 
      { command: command }, 
      { withCredentials: true }
    )
    console.log("Full backend response:", result.data) 
    return result.data
  } catch (error) {
    console.log("gemini api error:", error.response?.data)
    return null
  }
}

  useEffect(() => {
    handleCurrentUser()
  }, [])

  const value = {
    serverUrl,
    userData,
    setUserdata,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    loading,
    getGeminiresponse
  }

  return (
    <userdataContext.Provider value={value}>
      {children}
    </userdataContext.Provider>
  )
}

export { userdataContext }
export default UserContext

