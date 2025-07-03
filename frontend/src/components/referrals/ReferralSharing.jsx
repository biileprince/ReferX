// src/components/referrals/ReferralSharing.jsx
import React, { useState } from 'react';
import { FiLink, FiCopy, FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiMail } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';

const ReferralSharing = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  
  // Generate the referral link
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
  
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Share Your Referral Link</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-3">
          Share your unique referral link with friends and earn points when they sign up!
        </p>
        
        <div className="flex items-center">
          <div className="flex-grow flex items-center bg-gray-50 border border-gray-300 rounded-l-lg px-4 py-2">
            <FiLink className="text-gray-500 mr-2" />
            <span className="text-gray-700 truncate text-sm md:text-base">{referralLink}</span>
          </div>
          <Button 
            variant={copied ? "success" : "secondary"} 
            className="rounded-l-none rounded-r-lg px-4 py-2"
            onClick={copyToClipboard}
          >
            <FiCopy className="mr-1" /> {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Button 
          variant="primary" 
          className="w-full md:w-auto"
          onClick={() => setShowSocialOptions(!showSocialOptions)}
        >
          <FiShare2 className="mr-1" /> Share via...
        </Button>
        
        {showSocialOptions && (
          <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-full md:w-64">
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Share on social media</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-16"
                  onClick={shareOnTwitter}
                >
                  <FiTwitter className="text-blue-400 text-xl mb-1" />
                  <span className="text-xs">Twitter</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-16"
                  onClick={shareOnFacebook}
                >
                  <FiFacebook className="text-blue-600 text-xl mb-1" />
                  <span className="text-xs">Facebook</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-16"
                  onClick={shareOnLinkedIn}
                >
                  <FiLinkedin className="text-blue-700 text-xl mb-1" />
                  <span className="text-xs">LinkedIn</span>
                </Button>
              </div>
              
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={shareViaEmail}
                >
                  <FiMail className="mr-1" /> Share via Email
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">How it works</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Share your unique link with friends</li>
          <li>When they sign up using your link, you'll earn 10 points</li>
          <li>When they complete their first referral, you'll earn an additional 20 points</li>
          <li>Track your referrals in the "Your Referrals" section</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralSharing;