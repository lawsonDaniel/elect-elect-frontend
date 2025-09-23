"use client"
import React, { useState, useEffect } from 'react';
import { AlertCircle, CreditCard, User, Mail, DollarSign, Calendar, BookOpen } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import endPoints from '@/utils/endpoints.class';

// Types
interface User {
  _id: string;
  firstName: string;
  surname: string;
  fullName: string;
  schoolEmail: string;
  userType: 'student' | 'staff';
  level?: string;
  department?: string;
  faculty?: string;
  mattNumber?: string;
  staffId?: string;
  rank?: string;
}

interface PaymentData {
  paymentType: 'dues' | 'fee' | 'fine' | 'other';
  amount: number;
  metadata?: {
    description?: string;
    academicYear?: string;
    semester?: string;
  };
}

// Global window type extension for Paystack
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata?: any;
        callback: (response: any) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

const PaystackPayment: React.FC = () => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentType: 'dues',
    amount: 0,
    metadata: {
      description: '',
      academicYear: '2024/2025',
      semester: 'First',
    },
  });

  const { darkMode } = useDarkMode();
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key';

  // Load Paystack script when component mounts
  useEffect(() => {
    const loadPaystackScript = () => {
      // Check if we're in browser environment and script isn't already loaded
      if (typeof window !== 'undefined' && !window.PaystackPop) {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        
        script.onload = () => {
          console.log('Paystack script loaded successfully');
          setPaystackLoaded(true);
        };
        
        script.onerror = () => {
          console.error('Failed to load Paystack script');
          setError('Failed to load payment system. Please refresh the page and try again.');
        };
        
        document.head.appendChild(script);
        
        // Cleanup function to remove script if component unmounts
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      } else if (window.PaystackPop) {
        // Script already loaded
        setPaystackLoaded(true);
      }
    };

    loadPaystackScript();
  }, []);

  // Generate unique payment reference
  const generateReference = (): string => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `PAY_${timestamp}_${randomStr}`;
  };

  // Calculate dues amount based on user type and level
  const getDuesAmount = (userType: string, level?: string): number => {
    if (userType === 'student') {
      switch (level) {
        case '100':
        case '200':
          return 5000; // ₦5,000 for 100/200 level
        case '300':
        case '400':
        case '500':
          return 7000; // ₦7,000 for 300/400/500 level
        default:
          return 5000;
      }
    } else if (userType === 'staff') {
      return 10000; // ₦10,000 for staff
    }
    return 5000; // Default amount
  };

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        const profile = await endPoints.getUserProfile();
        console.log("User profile loaded:", profile);
        
        const userData = profile.user || profile;
        setUser(userData);
        
        // Set default dues amount based on user profile
        const defaultAmount = getDuesAmount(
          userData.userType, 
          userData.level
        );
        
        setPaymentData(prev => ({
          ...prev,
          amount: defaultAmount,
        }));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setError('Failed to load user profile. Please refresh the page and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Verify payment with backend after successful Paystack transaction
  const verifyPayment = async (reference: string) => {
    // try {
    //   setPaymentLoading(true);
    //   console.log('Verifying payment with reference:', reference);
      
    //   const verificationData = await endPoints.verifyPayment({ 
    //     reference,
    //     paymentData: {
    //       ...paymentData,
    //       userId: user?._id,
    //       email: user?.schoolEmail,
    //       reference: reference,
    //     }
    //   });
      
    //   if (verificationData.success && verificationData.data.status === 'success') {
    //     setSuccess('Payment completed successfully! Your transaction has been recorded.');
    //     setError('');
        
    //     // Reset form after successful payment
    //     setTimeout(() => {
    //       setSuccess('');
    //       setPaymentData(prev => ({
    //         ...prev,
    //         amount: getDuesAmount(user?.userType || 'student', user?.level),
    //         metadata: {
    //           ...prev.metadata,
    //           description: '',
    //         }
    //       }));
    //     }, 5000);
    //   } else {
    //     setError('Payment verification failed. Please contact support with your transaction reference.');
    //     console.error('Payment verification failed:', verificationData);
    //   }
    // } catch (error) {
    //   console.error('Payment verification error:', error);
    //   setError(error instanceof Error ? error.message : 'Payment verification failed. Please try again.');
    // } finally {
    //   setPaymentLoading(false);
    // }
  };

  // Handle payment button click
  const handlePayment = async () => {
    // Validation checks
    if (!user) {
      setError('User profile not loaded. Please refresh the page.');
      return;
    }

    if (paymentData.amount < 100) {
      setError('Amount must be at least ₦100');
      return;
    }

    if (!user.schoolEmail) {
      setError('Email address is required for payment');
      return;
    }

    if (!paystackLoaded || !window.PaystackPop) {
      setError('Payment system is still loading. Please wait and try again.');
      return;
    }

    // Clear previous messages
    setError('');
    setSuccess('');
    setPaymentLoading(true);

    try {
      const reference = generateReference();
      console.log('Initiating payment with reference:', reference);
      
      const config = {
        key: publicKey,
        email: user.schoolEmail,
        amount: paymentData.amount * 100, // Convert naira to kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Payment Type",
              variable_name: "payment_type",
              value: paymentData.paymentType
            },
            {
              display_name: "User ID",
              variable_name: "user_id", 
              value: user._id
            },
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: user.fullName
            },
            {
              display_name: "User Type",
              variable_name: "user_type",
              value: user.userType
            },
            {
              display_name: "Academic Year",
              variable_name: "academic_year",
              value: paymentData.metadata?.academicYear || '2024/2025'
            },
            {
              display_name: "Semester",
              variable_name: "semester",
              value: paymentData.metadata?.semester || 'First'
            },
            ...(paymentData.metadata?.description ? [{
              display_name: "Description",
              variable_name: "description",
              value: paymentData.metadata.description
            }] : []),
            ...(user.userType === 'student' ? [
              {
                display_name: "Level",
                variable_name: "level",
                value: user.level || ''
              },
              {
                display_name: "Matric Number",
                variable_name: "matric_number",
                value: user.mattNumber || ''
              }
            ] : []),
            ...(user.userType === 'staff' ? [
              {
                display_name: "Staff ID",
                variable_name: "staff_id",
                value: user.staffId || ''
              },
              {
                display_name: "Rank",
                variable_name: "rank",
                value: user.rank || ''
              }
            ] : [])
          ]
        },
        callback: (response: any) => {
          console.log('Payment successful:', response);
          verifyPayment(response.reference);
        },
        onClose: () => {
          setPaymentLoading(false);
          console.log('Payment modal closed');
        }
      };

      // Initialize Paystack payment modal
      const handler = window.PaystackPop.setup(config);
      handler.openIframe();
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError('Failed to initialize payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  // Handle input changes for form fields
  const handleInputChange = (
    field: keyof PaymentData,
    value: string | number | object
  ) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Show loading state while fetching user profile
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-[#070E12]' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
            darkMode ? 'border-blue-400' : 'border-blue-600'
          }`}></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading user profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
      darkMode ? 'bg-[#070E12]' : 'bg-gray-50'
    }`}>
      <div className="max-w-2xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Pay Your Dues
          </h1>
          <p className={`mt-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Complete your payment securely with Paystack
          </p>
        </div>

        {/* User Information Card */}
        {user && (
          <div className={`rounded-lg shadow-md p-6 mb-6 ${
            darkMode 
              ? 'bg-[#101E27] border border-[#2A3F4E]' 
              : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <User className="mr-2 h-5 w-5" />
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Full Name</p>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.fullName}
                </p>
              </div>
              <div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Email</p>
                <p className={`font-medium flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Mail className="mr-1 h-4 w-4" />
                  {user.schoolEmail}
                </p>
              </div>
              <div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>User Type</p>
                <p className={`font-medium capitalize ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {user.userType}
                </p>
              </div>
              
              {/* Student-specific fields */}
              {user.userType === 'student' && (
                <>
                  <div>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Level</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.level}
                    </p>
                  </div>
                  <div>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Matric Number</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.mattNumber}
                    </p>
                  </div>
                </>
              )}
              
              {/* Staff-specific fields */}
              {user.userType === 'staff' && (
                <>
                  <div>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Staff ID</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.staffId}
                    </p>
                  </div>
                  <div>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Rank</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.rank}
                    </p>
                  </div>
                </>
              )}
              
              <div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Department</p>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.department}
                </p>
              </div>
              <div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Faculty</p>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.faculty}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        <div className={`rounded-lg shadow-md p-6 ${
          darkMode 
            ? 'bg-[#101E27] border border-[#2A3F4E]' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 flex items-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Details
          </h2>

          <div className="space-y-4">
            
            {/* Payment Type Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Payment Type
              </label>
              <select
                value={paymentData.paymentType}
                onChange={(e) => handleInputChange('paymentType', e.target.value as PaymentData['paymentType'])}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-[#1A2B36] border-[#2A3F4E] text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="dues">Dues</option>
                <option value="fee">Fees</option>
                <option value="fine">Fine</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <DollarSign className="inline h-4 w-4 mr-1" />
                Amount (₦)
              </label>
              <input
                type="number"
                value={paymentData.amount}
                onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
                min="100"
                step="50"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-[#1A2B36] border-[#2A3F4E] text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter amount"
              />
              {paymentData.paymentType === 'dues' && user && (
                <p className={`mt-1 text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Recommended: ₦{getDuesAmount(user.userType, user.level).toLocaleString()}
                </p>
              )}
            </div>

            {/* Academic Year Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <Calendar className="inline h-4 w-4 mr-1" />
                Academic Year
              </label>
              <select
                value={paymentData.metadata?.academicYear || '2024/2025'}
                onChange={(e) => handleInputChange('metadata', {
                  ...paymentData.metadata,
                  academicYear: e.target.value,
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-[#1A2B36] border-[#2A3F4E] text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="2024/2025">2024/2025</option>
                <option value="2025/2026">2025/2026</option>
                <option value="2023/2024">2023/2024</option>
              </select>
            </div>

            {/* Semester Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <BookOpen className="inline h-4 w-4 mr-1" />
                Semester
              </label>
              <select
                value={paymentData.metadata?.semester || 'First'}
                onChange={(e) => handleInputChange('metadata', {
                  ...paymentData.metadata,
                  semester: e.target.value,
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-[#1A2B36] border-[#2A3F4E] text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="First">First Semester</option>
                <option value="Second">Second Semester</option>
                <option value="Summer">Summer Session</option>
              </select>
            </div>

            {/* Description/Notes */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Description (Optional)
              </label>
              <textarea
                value={paymentData.metadata?.description || ''}
                onChange={(e) => handleInputChange('metadata', {
                  ...paymentData.metadata,
                  description: e.target.value,
                })}
                rows={3}
                maxLength={200}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-[#1A2B36] border-[#2A3F4E] text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter payment description or notes..."
              />
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {paymentData.metadata?.description?.length || 0}/200 characters
              </p>
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className={`mt-4 p-4 border rounded-md ${
              darkMode 
                ? 'bg-red-900/20 border-red-800/50' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex">
                <AlertCircle className={`h-5 w-5 flex-shrink-0 ${
                  darkMode ? 'text-red-400' : 'text-red-400'
                }`} />
                <div className="ml-3">
                  <p className={`text-sm ${
                    darkMode ? 'text-red-300' : 'text-red-800'
                  }`}>
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message Display */}
          {success && (
            <div className={`mt-4 p-4 border rounded-md ${
              darkMode 
                ? 'bg-green-900/20 border-green-800/50' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className={`h-5 w-5 ${
                    darkMode ? 'text-green-400' : 'text-green-400'
                  }`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    darkMode ? 'text-green-300' : 'text-green-800'
                  }`}>
                    {success}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className={`mt-6 p-4 rounded-md ${
            darkMode ? 'bg-[#1A2B36]' : 'bg-gray-50'
          }`}>
            <h3 className={`font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Payment Summary
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Payment Type:
                </span>
                <span className={`capitalize font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {paymentData.paymentType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Amount:
                </span>
                <span className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ₦{paymentData.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Academic Year:
                </span>
                <span className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {paymentData.metadata?.academicYear}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Semester:
                </span>
                <span className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {paymentData.metadata?.semester} Semester
                </span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={paymentLoading || !user || paymentData.amount < 100 || !paystackLoaded}
            className={`w-full mt-6 font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center ${
              paymentLoading || !user || paymentData.amount < 100 || !paystackLoaded
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white'
            }`}
          >
            {!paystackLoaded ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Loading Payment System...
              </>
            ) : paymentLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {success ? 'Verifying Payment...' : 'Processing...'}
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Pay ₦{paymentData.amount.toLocaleString()} with Paystack
              </>
            )}
          </button>

          {/* Security Notice */}
          <p className={`mt-4 text-xs text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            🔒 Your payment is secured by Paystack. We do not store your card details.
          </p>
        </div>

        {/* Payment History Link */}
        <div className="mt-6 text-center">
          <a
            href="/dashboard/payment/history"
            className={`text-sm font-medium hover:underline ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            View Payment History →
          </a>
        </div>
        
        {/* Footer Info */}
        <div className={`mt-8 text-center text-xs ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p>For support, contact the school administration or IT department.</p>
        </div>
      </div>
    </div>
  );
};

export default PaystackPayment;