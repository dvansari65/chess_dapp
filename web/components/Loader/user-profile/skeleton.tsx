
const UserProfileSkeleton = () => {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {/* Username skeleton */}
        <div>
          <div className="h-3 bg-slate-700 rounded w-16 mb-2"></div>
          <div className="h-6 bg-slate-700 rounded w-32"></div>
        </div>
  
        {/* Wins and Losses grid skeleton */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <div className="h-3 bg-slate-700 rounded w-12 mx-auto mb-2"></div>
            <div className="h-6 bg-slate-700 rounded w-8 mx-auto"></div>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <div className="h-3 bg-slate-700 rounded w-12 mx-auto mb-2"></div>
            <div className="h-6 bg-slate-700 rounded w-8 mx-auto"></div>
          </div>
        </div>
  
        {/* Rating skeleton */}
        <div className="bg-slate-800/60 rounded-lg p-3 text-center">
          <div className="h-3 bg-slate-700 rounded w-12 mx-auto mb-2"></div>
          <div className="h-6 bg-slate-700 rounded w-16 mx-auto"></div>
        </div>
  
        {/* Joined date skeleton */}
        <div className="mt-6">
          <div className="h-3 bg-slate-700 rounded w-20 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-28"></div>
        </div>
      </div>
    );
  };
  
export default UserProfileSkeleton