import React from 'react';
import { useQuery } from '@tanstack/react-query';

import RewardCard from './RewardCard';

import { getAvailableRewards } from './../../services/reward';
import Loader from './../ui/Loader';

const RewardsList = () => {
  const { data: rewards, isLoading, isError } = useQuery({
    queryKey: ['rewards'],
    queryFn: getAvailableRewards,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load rewards</p>
      </div>
    );
  }

  if (!rewards || rewards.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No rewards available at the moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {rewards.map((reward) => (
        <RewardCard key={reward._id} reward={reward} />
      ))}
    </div>
  );
};

export default RewardsList;