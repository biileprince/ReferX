import React from 'react';
import { FiAward, FiUser, FiBarChart2 } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../../services/referral';
import Loader from '../ui/Loader';
import Button from '../ui/Button';

const Leaderboard = () => {
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });

  const leaderboard = response?.data || response || [];
  
  if (isLoading) {
    return <Loader className="py-4" />;
  }

  if (isError) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-2">Failed to load leaderboard</p>
        <Button variant="secondary" size="sm" onClick={refetch}>
          <FiRefreshCw className="mr-1" /> Retry
        </Button>
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-2">
          <FiBarChart2 className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500">No leaderboard data available</p>
        <p className="text-gray-400 text-sm mt-1">Be the first to submit a referral!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leaderboard.map((user, index) => (
        <div 
          key={user._id} 
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              index === 0 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
              index === 1 ? 'bg-gray-100 text-gray-800 border border-gray-300' :
              index === 2 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 
              'bg-blue-100 text-blue-800 border border-blue-300'
            }`}>
              {index + 1}
            </div>
            <div className="flex items-center">
              <div className="h-9 w-9 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                {user.name?.charAt(0) || <FiUser className="h-5 w-5 text-gray-500" />}
              </div>
              <div>
                <div className="font-medium text-gray-900 truncate max-w-[120px]">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 truncate max-w-[120px]">
                  {user.referralCode}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <FiAward className={`mr-1 h-5 w-5 ${
              index === 0 ? 'text-yellow-500' :
              index === 1 ? 'text-gray-500' :
              index === 2 ? 'text-amber-500' : 
              'text-blue-500'
            }`} />
            <span className="font-semibold">{user.points} pts</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;