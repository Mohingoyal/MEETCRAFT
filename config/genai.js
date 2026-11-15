var {GoogleGenerativeAI}=require("@google/generative-ai");
require('dotenv').config();
//console.log(process.env.ATLAS_URL);
// import { GoogleGenAI } from "@google/genai";
var genAI=new GoogleGenerativeAI(process.env.GEMINIAPI2);
var genaimodel=genAI.getGenerativeModel({model:"gemini-3.5-flash"})
module.exports=genaimodel