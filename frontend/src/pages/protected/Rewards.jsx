// src/pages/protected/Rewards.jsx
import React from 'react';
import { FiAward, FiGift } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import RewardsList from '../../components/rewards/RewardsList';
import StatsCard from '../../components/dashboard/StatsCard';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import UserRewards from '../../components/rewards/UserRewards';

const Rewards = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Rewards Center</h1>
              <p className="mt-1 text-gray-600">
                Redeem your points for exciting rewards
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard 
                title="Your Points" 
                value={user?.points || 0} 
                icon={FiAward} 
                color="primary" 
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Available Rewards</h2>
                  </div>
                  <RewardsList />
                </div>
              </div>
              
              <div>
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Your Claimed Rewards</h2>
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <FiGift className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <UserRewards />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Rewards;