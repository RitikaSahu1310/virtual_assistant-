import jwt from "jsonwebtoken"
const isAuth=async (req,res,next )=>{
    try {
       const token = req.cookies.token
       if(!token){
        return res.status(400).json({message:"token not found"})
       } 
        const verifyToken=await jwt.verify(token,process.env.JWT_SECRET)
        req.userId = verifyToken.userId

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"is Auth error"})
    }

}
 export default isAuth

// import jwt from "jsonwebtoken"

// const isAuth = (req, res, next) => {
//   try {
//     const token = req.cookies.token   // ✅ IMPORTANT FIX

//     if (!token) {
//       return res.status(400).json({ message: "token not found" })
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)

//     req.userId = decoded.id   // ya decoded.userId (depends on your token)

//     next()
//   } catch (error) {
//     return res.status(401).json({ message: "invalid token" })
//   }
// }

// export default isAuth

