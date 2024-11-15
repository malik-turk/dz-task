'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const totalAmount = cart.reduce((sum, item) => sum + item.price.amount * item.quantity, 0);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.email) {
      alert('Please fill out all shipping information');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { id: 'user-id', name: shippingInfo.name },
          products: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      });

      if (res.ok) {
        alert('Order placed successfully!');
        clearCart();
        router.push('/orders');
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Shipping Information</h2>
        <div className="grid gap-4 mt-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={shippingInfo.name}
            onChange={handleInputChange}
            className="border rounded p-2"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            className="border rounded p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={shippingInfo.email}
            onChange={handleInputChange}
            className="border rounded p-2"
          />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <ul className="mt-2">
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between border-b py-2">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price.amount * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="text-xl font-bold mt-4">Total: ${totalAmount.toFixed(2)}</p>
      </div>
      <button
        onClick={handleSubmitOrder}
        disabled={isProcessing}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}
