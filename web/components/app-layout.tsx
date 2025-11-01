import Navbar from "./Navbar";


function AppLayout ({children}:{children:React.ReactNode}){
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <main className="">
                {children}
            </main>
        </div>
    )
}
export default AppLayout