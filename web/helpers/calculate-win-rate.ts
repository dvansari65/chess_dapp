export const calculateWinRate = (matchesPlayed:number | undefined,wins:number | undefined)=>{
    if(wins == null ){
        return null;
    }
    if(matchesPlayed == null){
        return null;
    }
   const winRate = ( wins/matchesPlayed)*100
   return winRate;
}