import React, { useState } from 'react';
import { FiUser, FiMail } from 'react-icons/fi';
import Button from '../ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitReferral } from '../../services/referral';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ReferralForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  
  const mutation = useMutation({
    mutationFn: submitReferral,
    onSuccess: () => {
      toast.success('Referral submitted successfully!');
      setFormData({ name: '', email: '' });
      setErrors({});
      queryClient.invalidateQueries(['referrals']);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit referral');
      
      // Handle backend validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic client-side validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    mutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a New Referral</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
              className={`pl-10 input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              className={`pl-10 input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            variant="primary"
            isLoading={mutation.isPending}
          >
            Submit Referral
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReferralForm;