import Link from 'next/link';

const Breadcrumbs_Quote = ({ businessName }) => {
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
                {businessName && (
                    <>
                        <li>
                            <span className="mx-2">/</span>
                            <Link href={`/business/${router.query.id}`}>
                                <span className="text-blue-500">{business}</span>
                            </Link>
                        </li>
                        <li>
                            <span className="mx-2">/</span>
                            <span>Get a Quote</span>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Breadcrumbs_Quote;
