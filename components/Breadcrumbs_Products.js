import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Breadcrumbs_Products = ({ businessName }) => {
  const router = useRouter();  // Ensure router is properly initialized here
  const [business, setBusiness] = useState('');

  useEffect(() => {
    if (businessName) {
      setBusiness(businessName);
    }
  }, [businessName]);

  return (
    <nav className="breadcrumb">
      <ul className="flex space-x-2">
        <li>
          <Link href="/">
            <span className="text-blue-500">Home</span>
          </Link>
        </li>
        <li>
          <span className="mx-2">/</span>
          <Link href="/businesses">
            <span className="text-blue-500">Businesses</span>
          </Link>
        </li>
        {business && (
          <>
            <li>
              <span className="mx-2">/</span>
              <Link href={`/business/${router.query.id}`}> {/* Using router.query.id */}
                <span className="text-blue-500">{business}</span>
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
              <span>Products</span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Breadcrumbs_Products;
