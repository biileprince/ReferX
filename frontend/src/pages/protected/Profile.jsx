// src/pages/protected/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiCopy, FiCheck, FiAward } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../../services/auth';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';

const Profile = () => {
  const { user, updateAuthUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const updatedUser = await updateProfile(profileData);
      updateAuthUser(updatedUser.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="mt-1 text-gray-600">
                Manage your account information and referral settings
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Account Overview Card */}
              <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Account Overview</h2>
                
                <div className="flex flex-col items-center mb-6">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                    <span className="font-bold text-3xl text-primary-700">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">{user?.name || 'User'}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex items-center">
                      <FiAward className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Points Balance</p>
                        <p className="font-bold text-xl text-gray-800">{user?.points || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <FiMail className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium">Email Status</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user?.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user?.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    {!user?.isVerified && (
                      <p className="text-sm text-gray-600 mt-2">
                        Check your email for verification instructions
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Information Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Profile Information</h2>
                  
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="pl-10 input-field w-full"
                          value={profileData.name}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="pl-10 input-field w-full bg-gray-50 cursor-not-allowed"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          disabled
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        For security reasons, email addresses cannot be changed
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        isLoading={isUpdating}
                        disabled={isUpdating}
                        className="w-full sm:w-auto"
                      >
                        Update Profile
                      </Button>
                    </div>
                  </form>
                </div>
                
                {/* Referral Section Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Your Referral Code</h2>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Share your unique code with friends to earn points when they sign up and make their first referral.
                    </p>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-100">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-700">Personal Referral Code</h3>
                        <button 
                          onClick={copyReferralCode}
                          className="flex items-center text-primary-600 hover:text-primary-800 font-medium"
                        >
                          {copied ? (
                            <>
                              <FiCheck className="h-4 w-4 mr-1" /> Copied
                            </>
                          ) : (
                            <>
                              <FiCopy className="h-4 w-4 mr-1" /> Copy Code
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="mt-4 bg-white border-2 border-dashed border-primary-300 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-lg font-bold text-gray-800">
                            {user?.referralCode || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center text-sm text-gray-600">
                        <div className="bg-gray-200 rounded-full p-1 mr-2">
                          <FiAward className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span>Earn 30 points for each successful referral</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <h3 className="font-medium text-blue-800 mb-2">How it works</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        <li>Share your unique referral code with friends</li>
                        <li>They sign up using your referral code</li>
                        <li>You get 30 points when they make their first referral</li>
                        <li>Redeem points for rewards in the Rewards section</li>
                      </ul>
                    </div>
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

export default Profile;