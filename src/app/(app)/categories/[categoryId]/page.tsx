'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/app';
import Image from 'next/image';

interface CategoryProductsPageProps {
  params: { categoryId: string };
}

const LIMIT = 9;

export default function CategoryProductsPage({ params }: CategoryProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  console.log(products);

  const fetchProducts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const newProducts = await fetchProductsByCategory(params.categoryId, page, LIMIT);

      setProducts(prevProducts => [...prevProducts, ...newProducts]);
      setHasMore(newProducts.length === LIMIT);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 && !loading && hasMore) {
        fetchProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Products in Category</h1>
      {products.length === 0 && !loading ? (
        <p>No products found for this category.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} className='border p-4 rounded shadow-lg'>
              <div className='flex flex-col items-center'>
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
              </div>
            </Link>
          ))}
        </div>
      )}
      {loading && <p>Loading more products...</p>}
    </div>
  );
}

// Updated fetch function with pagination
async function fetchProductsByCategory(categoryId: string, page: number, limit: number): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?category=${categoryId}&page=${page}&limit=${limit}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await res.json();
  return data.data;
}
