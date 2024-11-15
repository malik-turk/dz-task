'use client'

import { useEffect, useState } from 'react';
import { Order } from '@/types/app';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Order History</h1>
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-semibold">Order #{order.id}</h2>
            <p className="text-gray-500">Date: {new Date(order.timestamp ?? '').toLocaleDateString()}</p>
            <p className="text-gray-700 mt-2">Status: {order.status}</p>
            <ul className="mt-4">
              {order.cart.items.map((item) => (
                <li key={item.id} className="flex justify-between border-b py-2">
                  <span>
                    {item.type === 'PRODUCT' ? item.referenceId : item.type} (x{item.quantity})
                  </span>
                  <span>${(item.price.amount * (item.quantity || 1)).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold mt-4">Total: ${order.cart.total.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
