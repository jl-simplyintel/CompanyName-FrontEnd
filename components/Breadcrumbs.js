import Link from 'next/link';
import { useRouter } from 'next/router';

const Breadcrumbs = () => {
  const router = useRouter();
  const pathArray = router.pathname.split('/').filter((path) => path);

  return (
    <nav className="breadcrumb">
      <ul className="flex space-x-2">
        <li>
          <Link href="/">
            <a className="text-blue-500">Home</a>
          </Link>
        </li>
        {pathArray.map((path, index) => {
          const fullPath = `/${pathArray.slice(0, index + 1).join('/')}`;
          const isLast = index === pathArray.length - 1;
          return (
            <li key={index}>
              <span className="mx-2">/</span>
              {isLast ? (
                <span>{path}</span>
              ) : (
                <Link href={fullPath}>
                  <a className="text-blue-500 capitalize">{path}</a>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
