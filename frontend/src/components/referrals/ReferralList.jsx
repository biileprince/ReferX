// src/components/referrals/ReferralList.jsx
import React from 'react';
import { FiMail, FiUser, FiClock, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getUserReferrals } from '../../services/referral';
import Loader from '../ui/Loader';
import Button from '../ui/Button';

const ReferralList = () => {
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['referrals'],
    queryFn: getUserReferrals,
  });

  // Extract referrals from response data
  const referrals = response?.data || response || [];

  if (isLoading) {
    return <Loader className="py-10" />;
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load referrals</p>
        <Button variant="secondary" onClick={refetch}>
          <FiRefreshCw className="mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  if (!referrals || referrals.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No referrals found</p>
        <p className="text-gray-400 text-sm">Submit your first referral using the form above</p>
      </div>
    );
  }
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {referrals.map((referral) => (
              <tr key={referral._id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{referral.refereeName}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiMail className="mr-2 h-4 w-4 text-gray-400" />
                    {referral.refereeEmail}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    referral.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : referral.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {referral.status === 'completed' ? (
                      <>
                        <FiCheck className="mr-1 h-3 w-3" /> Completed
                      </>
                    ) : referral.status === 'pending' ? (
                      <>
                        <FiClock className="mr-1 h-3 w-3" /> Pending
                      </>
                    ) : (
                      <>
                        <FiX className="mr-1 h-3 w-3" /> Rejected
                      </>
                    )}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(referral.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {referral.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralList;