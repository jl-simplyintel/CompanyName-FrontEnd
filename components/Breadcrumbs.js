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
        {pathArray[0] === 'business' ? (
          <>
            <li>
              <span className="mx-2">/</span>
              <Link href="/business">
                <span className="text-blue-500">Businesses</span>
              </Link>
            </li>
            {business && (
              <li>
                <span className="mx-2">/</span>
                <span>{business}</span>
              </li>
            )}
          </>
        ) : (
          pathArray.map((path, index) => {
            const fullPath = `/${pathArray.slice(0, index + 1).join('/')}`;
            const isLast = index === pathArray.length - 1;
            return (
              <li key={index}>
                <span className="mx-2">/</span>
                {isLast ? (
                  <span>{path}</span>
                ) : (
                  <Link href={fullPath}>
                    <span className="text-blue-500 capitalize">{path}</span>
                  </Link>
                )}
              </li>
            );
          })
        )}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
