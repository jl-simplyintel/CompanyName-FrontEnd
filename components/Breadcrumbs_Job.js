import Link from 'next/link';

export default function Breadcrumbs_Job({ businessName, jobTitle, businessId }) {
  return (
    <nav className="text-sm text-gray-500 mb-6">
      <ol className="list-reset flex">
        <li>
          <Link href="/">
            <a className="text-blue-600 hover:underline">Home</a>
          </Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li>
          <Link href="/businesses">
            <a className="text-blue-600 hover:underline">Businesses</a>
          </Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li>
          <Link href={`/business/${businessId}`}>
            <a className="text-blue-600 hover:underline">{businessName}</a>
          </Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li className="text-gray-700">{jobTitle}</li>
      </ol>
    </nav>
  );
}
