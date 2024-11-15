import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='bg-gray-800 p-4 text-white'>
      <ul className='flex space-x-4'>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <Link href='/products'>Products</Link>
        </li>
        <li>
          <Link href='/categories'>Categories</Link>
        </li>
      </ul>
    </nav>
  );
}
