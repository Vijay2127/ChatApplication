import {create} from "zustand" //state management library
import { axiosinstance } from "../lib/axios.js";
import toast from "react-hot-toast";



export const useAuthStore=create((set)=>({  //zustand store
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
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
        set({isSigningUp:true});
        try {
            const res=await axiosinstance.post("/auth/signup",data);
            // console.log(res)
            set({authUser:res.data});
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp:false});
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res=await axiosinstance.post("/auth/login",data);
            console.log(res);
            set({authUser:res.data});
            toast.success("Login successfully");
        } catch (error) {
            toast.error(error.response.data.message);
            
        }finally{
            set({isLoggingIn:false})
        }
    },
    logout:async ()=>{
        try {
            await axiosinstance.post("/auth/logout");
            set({authUser:null});
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    isUpdatingProfile:async(data)=>{

    }
}));