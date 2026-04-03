import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import { userdataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/assistantGif.mp4"
import userImage from "../assets/gifvoice.gif"
import { GrMenu } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";

function Home() {
  const{userData,serverUrl,setUserdata,getGeminiresponse}=useContext(userdataContext)
  const navigate= useNavigate()
  const [listening,setListening] = useState(false)
  const [userText,setUserText] =useState("")
  const [aiText,setAiText]= useState("")
  const isSpeakingRef= useRef(false)
  const recognititonRef=useRef(null)
  const [ham,setHam]= useState(false)
  const isRecognizingRef =useRef(false)
  const synth=window.speechSynthesis

  const handleLogOut = async()=>{
    try {
      const result= await axios.get(`${serverUrl}/api/auth/logout`,
        {withCredentials:true})
        setUserdata(null)
        navigate("/signin")
    } catch (error) {
      setUserdata(null)
      console.log(error)
    }
  }
   const startRecognition = ()=>{
    try {
      recognititonRef.current?.start()
      setListening(true)
    } catch (error) {
      if(!error.message.includes("start")){
        console.error("recognition error:", error)
      }
    }
   }

  const speak= (text)=>{
     const utterence = new SpeechSynthesisUtterance(text)
     utterence.lang = "hi-IN"
     const voices = window.speechSynthesis.getVoices()
     const hindiVoice = voices.find(v=> v.lang ==="hi-IN")
     if(hindiVoice){
      utterence.voice = hindiVoice
     }



     isSpeakingRef.current=true
     utterence.onend=()=>{
      setAiText("")
      isSpeakingRef.current=false
      startRecognition()
     }
     synth.speak(utterence)
  }

const handleCommand = (data) => {
  if (!data || !data.type) {
    console.log("Invalid response:", data.type)
    speak("Sorry, I didn't understand that.")
    return
  }

  const { type, userInput, response } = data

  // ✅ Pehle window open karo
  if (type === 'google_search') {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank')
  }
  if (type === 'calculator_open') {
    window.open('https://www.google.com/search?q=calculator', '_blank')
  }
  if (type === 'instagram_open') {
    window.open('https://www.instagram.com/', '_blank')
  }
  if (type === 'facebook_open') {
    window.open('https://www.facebook.com/', '_blank')
  }
  if (type === 'weather_show') {
    window.open('https://www.google.com/search?q=weather', '_blank')
  }
  if (type === 'youtube_search' || type === 'youtube_play') {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank')
  }

  // ✅ Baad mein speak karo
  speak(response)
}
 
  useEffect(()=>{
    const SpeechRecognition =window.SpeechRecognition || window.webkitSpeechRecognition
    
    const recognition = new SpeechRecognition()
    recognition.continuous=false
    recognition.lang="en-US"


    recognititonRef.current = recognition

    

    const safeRecognition=()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
       try {
         isRecognizingRef.current = true 
        recognition.start()
        console.log("recognition requesed to start")
       } catch (err) {
         isRecognizingRef.current = false
        if(err.name !== "invalidStateError"){
          console.log("start error:", err)
        }
       }  
      }
    }

    recognition.onstart = () =>{
      console.log("recognition started")
      isRecognizingRef.current = true
      setListening(true)
    }


    
    recognition.onend = () =>{
      console.log("recognition ended")
      isRecognizingRef.current = false
      setListening(false)
   
        if(!isSpeakingRef.current){
             setTimeout(()=>{
             safeRecognition()
      },1000)
    }
  }

  recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);

     if (event.error === "no-speech") {
    console.log("No speech detected, waiting...");
    return;
  }

    if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
            safeRecognition();
        }, 1000);
    }
};
  

     recognition.onresult= async(e)=>{
      const transcript=e.results[e.results.length-1][0].transcript.trim()
      console.log("Heard :"+ transcript)

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current=false
        setListening(false)
             const data=  await getGeminiresponse(transcript)
             console.log("data : " , data);
             handleCommand(data)
             setAiText(data.response)
             setUserText("")
      }
     }



    // const fallback = setInterval(()=>
    // {
    //   if(!isSpeakingRef.current && !isRecognizingRef.current){
    //     safeRecognition()
    //   }
    // },10000)


     safeRecognition()
    return ()=>{
      recognition.stop()
      setListening(false)
      isRecognizingRef.current=false
      // clearInterval(fallback)
    }
      
  },[])


  return (
    <div  className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>

       <GrMenu className='lg:hidden text-white absolute top-[10px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)} />
       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[15px] items-start ${ham?"translate-x-0":"translate-x-full"}`}>
              <RxCross2 className=' text-white absolute top-[10px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)} />
          
                <button className="min-w-[150px] h-[50px] text-black font-semibold  bg-white cursor-pointer rounded-full text-[18px] hover:bg-gray-200 transition" onClick={ handleLogOut}>Log Out</button>
                <button className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-full cursor-pointer text-[18px] hover:bg-gray-200 transition px-[20px] py-[10px]" onClick={()=>navigate("/customize")}>Customize your Assistant</button>
         <div className='w-full h-[2px] bg-gray-400'></div>
          <h1 className='text-white font-semibold text-[19px]'>History</h1>
          
           <div className='w-full h-[400px] overflow-y-auto flex flex-col gap-[20px]'>
               {userData.history?.map((his,index)=>(
                <span key={index} className="text-gray-200 text-[18px] truncate">{his}</span>
               ))}         
           </div>
       </div>
       <button className="mt-8 min-w-[150px] h-[50px] text-black font-semibold absolute top-[20px] right-[20px] bg-white cursor-pointer hidden lg:block rounded-full text-[18px] hover:bg-gray-200 transition" onClick={ handleLogOut}>Log Out</button>
      <button className="mt-8 min-w-[150px] h-[50px] text-black font-semibold bg-white absolute  top-[100px] right-[20px] rounded-full cursor-pointer text-[18px] hover:bg-gray-200 transition px-[20px] py-[10px] hidden lg:block" onClick={()=>navigate("/customize")}>Customize your Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
         <img src={userData?.assistantImage} alt="" className='h-full object-cover ' />
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
     {!aiText && <img src={userImage} alt="" className='w-[200px]'/>}
     {aiText && <img src={aiImg} alt="" className='w-[200px]'/>}

     <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>

    </div>
  )
}

export default Home