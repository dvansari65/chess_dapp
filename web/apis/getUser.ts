import { getUserResponse } from "@/types/player"
import { PublicKey } from "@solana/web3.js"
import { useQuery } from "@tanstack/react-query"

export const getPlayer = (publickey: PublicKey | null) => {
  return useQuery<getUserResponse>({
    queryKey: ["player", publickey?.toString()],
    enabled: !!publickey, // Only run query if publickey exists
    queryFn: async () => {
      try {
        const convertedKey = publickey?.toString()
        
        if (!convertedKey) {
          throw new Error("Public key is required")
        }

        const response = await fetch(`/api/user/${convertedKey}`)
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to fetch player!")
        }
        
        const data = await response.json()
        console.log("player data", data)
        return data
      } catch (error: any) {
        console.log(error.message)
        throw error
      }
    }
  })
}