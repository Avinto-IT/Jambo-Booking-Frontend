import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/middleware";

// async function resetPasswordHandler(req:NextApiRequest,res:NextApiResponse){
//     if(req.method!=="POST"){
//         res.status(40)
// }
