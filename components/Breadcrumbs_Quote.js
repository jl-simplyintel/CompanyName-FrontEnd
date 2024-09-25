// components\Breadcrumbs_Quote.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Breadcrumbs = ({ businessName }) => {
  const router = useRouter();
  const pathArray = router.pathname.split('/').filter((path) => path);

  // Set the breadcrumb label for business page
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
        {pathArray.includes('business') && (
          <>
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
                  <span>{business}</span>
                </li>
                <li>
                  <span className="mx-2">/</span>
                  <span>Get a Quote</span>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
