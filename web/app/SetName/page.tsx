"use client"
import { Register } from "@/apis/register";
import { useWallet } from "@solana/wallet-adapter-react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

function SetName({}) {
  const [userName,setUserName] = useState("")
  const {connected,publicKey} = useWallet()
  const {mutate,isPending,error,isError,reset} = Register()
  const router = useRouter()
  const handleSaveUser = (e: React.FormEvent)=>{
    e.preventDefault();
    if(userName.trim() === ""){
      toast.error("enter user name!")
      return;
    }
    if(!connected || !publicKey){
      toast.error("connect your wallet first!")
      return;
    }
    const publickey = publicKey.toString()
    console.log("publickey",publicKey)
    mutate({userName,publickey},{
      onSuccess:(data)=>{
        setUserName("")
        toast.success("user created successfully!")
      },
      onError:(error)=>{
        setUserName("")
        toast.error(error.message)
      }
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
    if(isError){
      reset()
    }
    setUserName(()=>e.target.value)
  }

  const backToHomePage = ()=>{
    router.push("/")
    setUserName("")
    reset()
  }
  

  return (
    <div className="w-full h-[70vh] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* Modal */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
        <form
          onSubmit={handleSaveUser}
          className="relative bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 p-8"
        >
          {/* Close button */}
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Set Your Name
            </h2>
            {error ? (
              <div className=" p-2 bg-[rgb(239,155,155)] rounded-[5px]">
                <p className="text-[rgb(188,54,54)] text-sm font-serif">
                  {error.message || "server error!"}
                </p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                Choose a name that represents you
              </p>
            )}
          </div>

          {/* Input */}
          <div className="space-y-2 mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={handleChange}
              placeholder="@Dannny"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={backToHomePage}
              className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              disabled={isPending}
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-blue-600/20"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SetName;
