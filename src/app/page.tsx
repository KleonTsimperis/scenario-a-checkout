import React from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CandidateTaskHUD } from '@/components/candidate/CandidateTaskHUD';

export default function CheckoutPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Store Checkout Assessment
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Test optimistic UI updates, out-of-order resolution, and SSR hydration resilience.
        </p>
      </div>

      <div className="flex justify-center">
        <CartDrawer />
      </div>

      {/* Floating In-App Candidate Sprint Console */}
      <CandidateTaskHUD />
    </main>
  );
}
