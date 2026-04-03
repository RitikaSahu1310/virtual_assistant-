// import React, { useContext } from 'react'
// import {Routes,Route} from "react-router-dom"
// import SignUp from './pages/SignUp'
// import SignIn from './pages/SignIn'
// import Customize from './pages/Customize'
// import  userData,{ userdataContext } from './context/userContext'
// import Home from './pages/Home'
// import { Navigate } from "react-router-dom";
// import Customize2 from './pages/Customize2'



// function App() {
//   const {userData, setUserdata} = useContext(userdataContext)
//   console.log("userData", userData)
//   if (loading) return <div>Loading...</div>  
//   return (
//   <Routes>
//     <Route path= '/' element={userData?.assistantImage && userData?.assistantName ?<Home/>: <Navigate to ={"/customize"}/>}/>
//     <Route path= '/signup' element={!userData?<SignUp/>:<Navigate to={"/customize"}/>}/>
//      <Route path= '/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
//      <Route path= '/customize' element={userData?<Customize/>:<Navigate to = {"/signup"}/>}/>
//      {/* <Route path='/customize' element={<Customize/>}/> */}
//      {/* <Route path='/customize2' element={<Customize2/>}/> */}

//        <Route path= '/customize2' element={userData?<Customize2/>:<Navigate to = {"/signup"}/>}/>
//   </Routes>
//   )
// }

// export default App


import React, { useContext } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import { userdataContext } from './context/UserContext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'

function App() {
  const { userData, setUserdata, loading } = useContext(userdataContext)
  console.log("userData:", userData)

  if (loading) return <div>Loading...</div>

  return (
    <Routes>
      <Route path='/' element={userData?.assistantImage && userData?.assistantName ? <Home /> : <Navigate to={"/customize"} />} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
      <Route path='/customize' element={userData ? <Customize /> : <Navigate to={"/signup"} />} />
      <Route path='/customize2' element={userData ? <Customize2 /> : <Navigate to={"/signup"} />} />
    </Routes>
  )
}

export default App
