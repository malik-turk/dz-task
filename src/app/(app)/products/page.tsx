'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/app';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className='container mx-auto p-4 text-center'>
        <p className='text-2xl font-semibold'>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto p-4 text-center'>
        <p className='text-2xl font-semibold text-red-500'>Error loading products.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Products</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {products.map(product => (
          <div key={product.id} className='border rounded-lg p-4 shadow-lg'>
            <Image
              loader={({ src }) => src}
              src={product.images?.[0]}
              alt={`${product.name} - ${product.description}`}
              className='mb-4 w-full h-40 object-cover'
              width={280}
              height={160}
              loading='lazy'
            />
            <h2 className='text-xl font-semibold'>{product.name}</h2>
            <p className='text-gray-700'>${product.price.amount}</p>
            <div className='flex gap-2 mt-4'>
              <button onClick={() => addToCart(product)} className='bg-blue-500 text-white px-4 py-2 rounded'>
                Add to Cart
              </button>
              <Link href={`/products/${product.id}`} className='bg-gray-200 px-4 py-2 rounded'>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
