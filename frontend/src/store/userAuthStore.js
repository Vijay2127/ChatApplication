import {create} from "zustand" //state management library
import { axiosinstance } from "../lib/axios.js";



export const useAuthStore=create((set)=>({  //zustand store
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,

    checkAuth:async()=>{
        try {
            const res=await axiosinstance.get("/auth/check");
            console.log(res)
            set({authUser:res.data});

        } catch (error) {
            console.log("Error in checkAuthudication",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },
    signup:async(data)=>{
        try {
            
        } catch (error) {
            
        }
    }
}));