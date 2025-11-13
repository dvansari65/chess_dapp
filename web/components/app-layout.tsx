import Navbar from "./navbar";


function AppLayout ({children,links}:{children:React.ReactNode,links: { label: string; path: string }[]}){
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar links={links}/>
            <main className="">
                {children}
            </main>
        </div>
    )
}
export default AppLayout