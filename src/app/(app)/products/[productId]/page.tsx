'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types/app';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        setProduct(data.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>{product.name}</h1>
      <div className='flex gap-8'>
        <Image
          loader={({ src }) => src}
          src={product.images?.[0]}
          alt={product.name}
          className='w-1/3 h-64 object-cover'
          width={280}
          height={160}
          loading='lazy'
        />
        <div className='flex flex-col gap-4'>
          <p className='text-lg text-gray-700'>{product.description}</p>
          <p className='text-xl font-semibold text-gray-900'>${product.price.amount}</p>
          <button onClick={() => addToCart(product)} className='bg-blue-500 text-white px-4 py-2 rounded mt-4'>
            Add to Cart
          </button>
        </div>
      </div>
      <div className='flex gap-4 mt-8'>
        {product.images.slice(1).map((image, index) => (
          <Image
            key={`${product.name}-${index}-image`}
            loader={({ src }) => src}
            src={image}
            alt={`${product.name} image ${index + 2}`}
            className='w-20 h-20 object-cover'
            width={280}
            height={160}
            loading='lazy'
          />
        ))}
      </div>
    </div>
  );
}
