import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, XCircle, Clock, ArrowRight, Home } from 'lucide-react';

interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    paidAt?: string;
    gatewayResponse?: string;
  };
}

const PaymentCallback: React.FC = () => {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [paymentResult, setPaymentResult] = useState<PaymentVerificationResponse | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const verifyPayment = async () => {
      const { reference, trxref } = router.query;
      const paymentReference = reference || trxref;

      if (!paymentReference) {
        setError('No payment reference found');
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ reference: paymentReference }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Verification failed');
        }

        const data: PaymentVerificationResponse = await response.json();
        setPaymentResult(data);
      } catch (error) {
        console.error('Payment verification error:', error);
        setError(error instanceof Error ? error.message : 'Verification failed');
      } finally {
        setVerifying(false);
      }
    };

    if (router.isReady) {
      verifyPayment();
    }
  }, [router.isReady, router.query]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      case 'failed':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Payment Failed',
          description: 'Your payment could not be processed.',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: <Clock className="h-16 w-16 text-yellow-500" />,
          title: 'Payment Pending',
          description: 'Your payment is being processed.',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
        };
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Verifying Payment...
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verification Error
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/payment')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No payment information available</p>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(paymentResult.data.status);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Status Header */}
          <div className={`p-8 text-center ${statusDisplay.bgColor} ${statusDisplay.borderColor} border-b`}>
            <div className="flex justify-center mb-4">
              {statusDisplay.icon}
            </div>
            <h1 className={`text-2xl font-bold ${statusDisplay.textColor} mb-2`}>
              {statusDisplay.title}
            </h1>
            <p className={`${statusDisplay.textColor} opacity-80`}>
              {statusDisplay.description}
            </p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Reference:</span>
                <span className="font-medium text-gray-900">
                  {paymentResult.data.reference}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">
                  ₦{paymentResult.data.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium capitalize ${
                  paymentResult.data.status === 'success' ? 'text-green-600' :
                  paymentResult.data.status === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {paymentResult.data.status}
                </span>
              </div>
              {paymentResult.data.paidAt && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Paid At:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(paymentResult.data.paidAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              {paymentResult.data.gatewayResponse && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Gateway Response:</span>
                  <span className="font-medium text-gray-900">
                    {paymentResult.data.gatewayResponse}
                  </span>
                </div>
              )}
            </div>

            {/* Success Message for Successful Payments */}
            {paymentResult.data.status === 'success' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Payment Confirmed
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      Your dues payment has been successfully processed. You will receive a confirmation email shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Failure Message for Failed Payments */}
            {paymentResult.data.status === 'failed' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Payment Failed
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      Your payment could not be processed. Please try again or contact support if the problem persists.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {paymentResult.data.status === 'success' ? (
                <>
                  <button
                    onClick={() => router.push('/payment/history')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
                  >
                    View Payment History
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/payment')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
                  >
                    Try Payment Again
                  </button>
                  <button
                    onClick={() => router.push('/payment/history')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md transition duration-200"
                  >
                    View Payment History
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </button>
                </>
              )}
            </div>

            {/* Support Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Need help? Contact support at{' '}
                <a 
                  href="mailto:support@unijos.edu.ng" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  support@unijos.edu.ng
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;