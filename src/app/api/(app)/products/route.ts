import { type NextRequest, NextResponse } from 'next/server';
import { data } from '@/lib/api';

export async function GET(request: NextRequest) {
  let { products } = data;

  // filter products by category if specified
  const category = request.nextUrl.searchParams.get('category');
  if (category) {
    products = products.filter((p) => p.categories.includes(category));
  }

  // pagination parameters
  const pageParam = request.nextUrl.searchParams.get('page');
  const limitParam = request.nextUrl.searchParams.get('limit');

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const limit = limitParam ? parseInt(limitParam, 10) : 10;

  // Calculate the start and end indices
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Return paginated products
  const paginatedProducts = products.slice(startIndex, endIndex);

  return NextResponse.json(
    {
      success: true,
      message: `Found ${paginatedProducts.length} product item(s) on page ${page}.`,
      data: paginatedProducts,
      total: products.length,
      page,
      limit,
    },
    {
      status: 200,
    },
  );
}
