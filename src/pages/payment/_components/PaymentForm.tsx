import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51QEn8FGvqg6Vjkbszj5NmxW69Rcr8XcEa1Dr6vwlvxr05s11PGb3wvJ4CZUxxDEQMUlK15swfMm6LPrRuCaKBpOx00T0ELPPmf');

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Payment Form Component
const PaymentForm = ({ selectedPlan, isYearly, plans, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const plan = plans[selectedPlan];
  const price = isYearly ? plan.yearly : plan.monthly;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !selectedPlan) return;

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) throw new Error(stripeError.message);

      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          planType: selectedPlan,
          billingType: isYearly ? 'yearly' : 'monthly',
          amount: price * 100,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Payment failed');
      
      window.location.href = '/paymentsucess';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold">Complete Your Subscription</h3>
        <p className="mt-2 text-sm text-gray-500">Enter your payment details below</p>
      </div>

      {/* Plan Summary */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <span>{plan.name} Plan ({isYearly ? 'Yearly' : 'Monthly'})</span>
          <span className="font-bold">${price}</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          <div className="font-medium mb-1">Plan Includes:</div>
          <ul className="list-disc pl-5 space-y-1">
            {plan.features.slice(0, 3).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Card Details
          </label>
          <div className="p-3 border rounded-md bg-white">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': { color: '#aab7c4' }
                },
                invalid: { color: '#fa755a' }
              }
            }} />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !stripe}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : `Pay $${price}`}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const SubscriptionPayment = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const plans = {
    basic: {
      name: 'Basic',
      monthly: 29.99,
      yearly: 299.99,
      features: [
        'Access to basic ML problems',
        '100 GPU minutes/month',
        'Community support',
        'Basic ML model templates',
        'Standard coding environment'
      ]
    },
    pro: {
      name: 'Professional',
      monthly: 49.99,
      yearly: 499.99,
      features: [
        'All Basic features',
        'Unlimited ML problems',
        '500 GPU minutes/month',
        'Priority support',
        'Advanced ML templates',
        'Custom development environment',
        'Team collaboration tools'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      monthly: 99.99,
      yearly: 999.99,
      features: [
        'All Pro features',
        'Unlimited GPU access',
        'Custom ML problem creation',
        '24/7 dedicated support',
        'Enterprise ML deployment',
        'Custom model hosting',
        'Advanced analytics',
        'Private team workspace'
      ]
    }
  };

  const handlePlanSelect = (planKey) => {
    setSelectedPlan(planKey);
    setShowModal(true);
  };

  const calculateSavings = (monthly, yearly) => {
    const monthlyCost = monthly * 12;
    const yearlyCost = yearly;
    return ((monthlyCost - yearlyCost) / monthlyCost * 100).toFixed(0);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm ${!isYearly ? 'font-bold' : ''}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isYearly ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isYearly ? 'font-bold' : ''}`}>
            Yearly (Save up to 20%)
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              onClick={() => handlePlanSelect(key)}
              className={`relative cursor-pointer transition-all rounded-lg border p-6 
                hover:shadow-xl hover:scale-105 hover:border-blue-500 transform transition-all duration-300
                ${selectedPlan === key ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                group`}
            >
              {key === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold group-hover:text-blue-600 transition-colors">
                  ${isYearly ? plan.yearly : plan.monthly}
                  <span className="text-sm font-normal">/{isYearly ? 'year' : 'month'}</span>
                </div>
                {isYearly && (
                  <div className="text-sm text-green-600">
                    Save {calculateSavings(plan.monthly, plan.yearly)}%
                  </div>
                )}
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 group-hover:transform group-hover:translate-x-1 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePlanSelect(key)}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Choose {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          {selectedPlan && (
            <PaymentForm
              selectedPlan={selectedPlan}
              isYearly={isYearly}
              plans={plans}
              onClose={() => setShowModal(false)}
            />
          )}
        </Modal>
      </div>
    </Elements>
  );
};

export default SubscriptionPayment;