// src/components/rewards/UserRewards.jsx
import React from 'react';
import { FiGift, FiCheckCircle } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';


import { format } from 'date-fns';
import { getUserRewards } from './../../services/reward';
import Loader from './../ui/Loader';

const UserRewards = () => {
  const { data: userRewards, isLoading, isError } = useQuery({
    queryKey: ['userRewards'],
    queryFn: getUserRewards
  });

  if (isLoading) return <Loader />;
  if (isError) return <div className="text-red-500 text-center py-4">Failed to load rewards</div>;
  if (!userRewards || userRewards.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
          <FiGift className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No rewards claimed yet</h3>
        <p className="text-gray-500">Start redeeming your points for exciting rewards!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userRewards.map(reward => (
        <div key={reward._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiCheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">{reward.reward.name}</h4>
                <p className="text-sm text-gray-500">Claimed on {format(new Date(reward.claimedAt), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              -{reward.reward.pointsRequired} points
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserRewards;