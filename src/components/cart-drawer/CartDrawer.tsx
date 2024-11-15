"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartDrawer() {
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <>
      <button onClick={toggleDrawer} className="fixed top-2 right-4 p-2 bg-blue-500 text-white rounded">
        🛒 Cart ({cartItems.length})
      </button>

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg p-4 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '300px' }}
      >
        <button onClick={toggleDrawer} className="mb-4 text-red-500">Close</button>

        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="border-b pb-2 mb-2">
                <div className="flex justify-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${(item.price.amount * item.quantity).toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cartItems.length > 0 && (
          <div className="mt-4">
            <p className="font-bold text-lg">Total: ${cartItems.reduce((acc, item) => acc + item.price.amount * item.quantity, 0).toFixed(2)}</p>
            <Link href="/checkout" className="mt-4 w-full bg-blue-500 text-white p-2 block rounded">Proceed to Checkout</Link>
          </div>
        )}
      </div>
    </>
  );
}
