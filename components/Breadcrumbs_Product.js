import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Breadcrumbs_Product = ({ businessName }) => {
    const router = useRouter();
    const [business, setBusiness] = useState('');

    useEffect(() => {
        if (businessName) {
            setBusiness(businessName);
            console.log('Business Name in Breadcrumbs:', businessName); // Log the business name
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
                            <Link href={`/business/${router.query.id}`}>
                                <span className="text-blue-500">{business}</span>
                            </Link>
                        </li>
                    </>
                )}
                <li>
                    <span className="mx-2">/</span>
                    <Link href={`/products/${router.query.id}`}>
                        <span className="text-blue-500">Products</span>
                    </Link>
                    <span>{product}</span>
                </li>
            </ul>
        </nav>
    );
};

export default Breadcrumbs_Product;
