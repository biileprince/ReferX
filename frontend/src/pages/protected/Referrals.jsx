// src/pages/protected/Referrals.jsx
import React, { useState } from 'react';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import ReferralForm from '../../components/referrals/ReferralForm';
import ReferralList from '../../components/referrals/ReferralList';
import Leaderboard from '../../components/referrals/Leaderboard';
import { useAuth } from '../../context/AuthContext';
import { FiLink, FiCopy, FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiMail, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';

const Referrals = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Generate the referral link
  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;
  
  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Share via email
  const shareViaEmail = () => {
    const subject = 'Join me on ReferralRewards!';
    const body = `Hi! I'm using ReferralRewards and thought you might like it. Sign up with my referral link to get bonus points: ${referralLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  // Share on Twitter
  const shareOnTwitter = () => {
    const text = `Join me on ReferralRewards! Sign up with my link to get bonus points: ${referralLink}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  // Share on Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const text = `Join me on ReferralRewards! Sign up with my link to get bonus points: ${referralLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Referral Management</h1>
              <p className="mt-1 text-gray-600">
                Submit new referrals and track your existing ones
              </p>
            </div>
            
            {/* Referral Sharing Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share Your Referral Link</h2>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Share your unique referral link with friends and earn points when they sign up!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <div className="flex-grow flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2">
                    <FiLink className="text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 truncate text-sm sm:text-base">{referralLink}</span>
                  </div>
                  <Button 
                    variant={copied ? "success" : "secondary"} 
                    className="sm:ml-2 px-4 py-2"
                    onClick={copyToClipboard}
                  >
                    <FiCopy className="mr-1" /> {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="primary" 
                  className="flex items-center justify-center gap-1 flex-1 min-w-[120px]"
                  onClick={shareOnWhatsApp}
                >
                  <FiMessageSquare className="text-lg" /> WhatsApp
                </Button>
                
                <Button 
                  variant="primary" 
                  className="flex items-center justify-center gap-1 flex-1 min-w-[120px]"
                  onClick={shareOnTwitter}
                >
                  <FiTwitter className="text-lg" /> Twitter
                </Button>
                
                <Button 
                  variant="primary" 
                  className="flex items-center justify-center gap-1 flex-1 min-w-[120px]"
                  onClick={shareOnFacebook}
                >
                  <FiFacebook className="text-lg" /> Facebook
                </Button>
                
                <Button 
                  variant="primary" 
                  className="flex items-center justify-center gap-1 flex-1 min-w-[120px]"
                  onClick={shareOnLinkedIn}
                >
                  <FiLinkedin className="text-lg" /> LinkedIn
                </Button>
                
                <Button 
                  variant="primary" 
                  className="flex items-center justify-center gap-1 flex-1 min-w-[120px]"
                  onClick={shareViaEmail}
                >
                  <FiMail className="text-lg" /> Email
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-100/50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">How it works</h3>
                <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li>Share your unique link with friends</li>
                  <li>When they sign up using your link, you earn 10 points</li>
                  <li>When they complete their first referral, you earn 20 more points</li>
                  <li>Track referrals in your dashboard</li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
         
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Your Referrals</h2>
                  <ReferralList />
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h2>
                  <Leaderboard />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Referrals;