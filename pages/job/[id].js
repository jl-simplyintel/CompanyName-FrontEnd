import { useRouter } from 'next/router';

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold">Hello, World!</h1>
      <p>Job ID: {id}</p>
    </div>
  );
}
