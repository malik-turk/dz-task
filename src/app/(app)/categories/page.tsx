import Link from 'next/link';
import { Category } from '@/types/app';

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/'}/api/categories`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await res.json();
  return data.data;
}

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Categories</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {categories.map(category => (
          <Link key={category.id} href={`/categories/${category.slug}`} className='border p-4 rounded shadow-lg'>
            <div className='flex flex-col items-center'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.name}
                className='mb-4 w-full h-40 object-cover'
              />
              <h2 className='text-xl font-semibold'>{category.name}</h2>
              <p className='text-gray-600'>{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
