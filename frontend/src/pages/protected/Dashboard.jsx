// src/pages/protected/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import StatsCard from '../../components/dashboard/StatsCard';
import Leaderboard from '../../components/referrals/Leaderboard'; // Import Leaderboard component
import { 
  FiUsers, 
  FiDollarSign, 
  FiAward, 
  FiShare2,
  FiClock,
  FiCheck,
  FiX,
  FiGift
} from 'react-icons/fi';
import { getDashboardStats, getRecentReferrals } from '../../services/dashboard';
import { getLeaderboard as fetchLeaderboard } from '../../services/referral';
import { getAvailableRewards } from '../../services/reward';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    referrals: true,
    leaderboard: true,
    rewards: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsData = await getDashboardStats();
        setStats(statsData);
        setLoading(prev => ({ ...prev, stats: false }));
        
        // Fetch recent referrals
        const referralsData = await getRecentReferrals();
        setRecentReferrals(referralsData);
        setLoading(prev => ({ ...prev, referrals: false }));
        
        // Fetch leaderboard
        const leaderboardData = await fetchLeaderboard();
        setLeaderboard(leaderboardData);
        setLoading(prev => ({ ...prev, leaderboard: false }));
        
        // Fetch available rewards
        const rewardsData = await getAvailableRewards();
        setRewards(rewardsData);
        setLoading(prev => ({ ...prev, rewards: false }));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setLoading({
          stats: false,
          referrals: false,
          leaderboard: false,
          rewards: false
        });
      }
    };

    fetchData();
  }, []);

  const statsData = stats ? [
    { title: 'Total Referrals', value: stats.totalReferrals, icon: FiUsers, change: '+0%', color: 'primary' },
    { title: 'Points Earned', value: stats.pointsEarned, icon: FiAward, change: '+0%', color: 'secondary' },
    { title: 'Rewards Claimed', value: stats.rewardsClaimed, icon: FiDollarSign, change: '+0%', color: 'success' },
    { title: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: FiShare2, change: '+0%', color: 'warning' },
  ] : [];

  const handleSubmitReferral = () => {
    navigate('/referrals');
  };

  const handleViewRewards = () => {
    navigate('/rewards');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">
                Welcome back, {user?.name}! Here's what's happening with your referrals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats ? (
                statsData.map((stat, index) => (
                  <StatsCard key={index} {...stat} />
                ))
              ) : (
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5">
                      <div className="animate-pulse flex items-center">
                        <div className="bg-gray-200 rounded-lg w-12 h-12"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Recent Referrals</h2>
                    <button 
                      onClick={() => navigate('/referrals')}
                      className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                    >
                      View all
                    </button>
                  </div>
                  
                  {loading.referrals ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="animate-pulse flex justify-between items-center py-3 border-b border-gray-200">
                          <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                          <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                          <div className="w-1/6 h-4 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentReferrals.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentReferrals.map((referral) => (
                            <tr key={referral._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{referral.refereeName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{referral.refereeEmail}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  referral.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : referral.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  {referral.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(referral.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>No recent referrals yet</p>
                      <button 
                        onClick={handleSubmitReferral}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        New Referral
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Leaderboard</h2>
                  <Leaderboard />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Available Rewards</h2>
                    <button 
                      onClick={handleViewRewards}
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View all
                    </button>
                  </div>
                  
                  {loading.rewards ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2].map((_, i) => (
                        <div key={i} className="animate-pulse border rounded-lg p-4">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-16 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : rewards.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {rewards.slice(0, 2).map((reward) => (
                        <div key={reward._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-center mb-3">
                            <div className="bg-blue-50 rounded-full p-3">
                              <FiGift className="h-8 w-8 text-blue-600" />
                            </div>
                          </div>
                          <h3 className="font-medium text-gray-900 text-center">{reward.name}</h3>
                          <div className="flex items-center justify-center mt-2">
                            <FiAward className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium text-gray-600">{reward.pointsRequired} points</span>
                          </div>
                          <div className="mt-3 text-center">
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Available
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="flex justify-center mb-2">
                        <FiGift className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No rewards available</p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <button 
                      onClick={handleViewRewards}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                    >
                      <FiGift className="mr-2" />
                      Browse Rewards
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;