import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Breadcrumbs_Products from '../../components/Breadcrumbs_Products';

export default function Products() {
  const router = useRouter();
  const { id } = router.query; // Use 'id' to match dynamic route [id].js
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProducts(id);
    }
  }, [id]);

  const fetchProducts = async (businessId) => {
    try {
      const query = `
      {
        products(where: { business: { id: "${businessId}" } }) {
          id
          name
          price
          stock
          images {
            file {
              url
            }
          }
        }
      }
      `;

      const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      setProducts(result.data?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No products found.</p>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <Breadcrumbs_Products />
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 shadow-lg rounded-lg">
            <div className="mb-4">
              {product.images && product.images[0]?.file?.url ? (
                <img src={product.images[0].file.url} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg" />
              )}
            </div>
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-2">${(product.price / 100).toFixed(2)}</p>
            <p className="text-gray-500">Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
