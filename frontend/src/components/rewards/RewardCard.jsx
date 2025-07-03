// src/components/rewards/RewardCard.jsx
import React from 'react';
import { FiGift } from 'react-icons/fi';
import Button from '../ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { claimReward } from '../../services/reward';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const RewardCard = ({ reward }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: () => claimReward(reward._id),
    onSuccess: (data) => {
      toast.success(`Reward claimed: ${reward.name}`);
      // Update user points in UI
      queryClient.setQueryData(['user'], (old) => ({
        ...old,
        points: data.user.points
      }));
      // Refresh rewards list
      queryClient.invalidateQueries(['rewards']);
      // Refresh user rewards
      queryClient.invalidateQueries(['userRewards']);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to claim reward');
    }
  });
  
  const canClaim = user?.points >= reward.pointsRequired;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg mr-4">
              <FiGift className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{reward.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{reward.description}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <FiGift className="text-yellow-500 mr-1" />
              <span className="font-bold text-gray-800">{reward.pointsRequired} points</span>
            </div>
            <Button
              variant={canClaim ? "primary" : "outline"}
              size="sm"
              className="mt-2"
              onClick={() => mutation.mutate()}
              disabled={!canClaim || mutation.isPending}
              isLoading={mutation.isPending}
            >
              {canClaim ? "Claim Reward" : "Not Enough Points"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;