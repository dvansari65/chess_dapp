"use client"
import { isServer, QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query"


function makeQueryClient (){
   return new QueryClient({
    defaultOptions:{
        queries:{
            staleTime:60*1000
        }
    }
   })
}
let browseQueryClient : QueryClient | undefined;
function getQueryClient (){
    if(isServer){
        return makeQueryClient()
    }else{
        if(!browseQueryClient) browseQueryClient = makeQueryClient()
        return browseQueryClient;
    }
}

function ReactQueryProvider ({children}:{children:React.ReactNode}){
    const queryClient = getQueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default ReactQueryProvider