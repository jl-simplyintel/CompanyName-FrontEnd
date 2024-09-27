import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Breadcrumbs_Job from '../../components/Breadcrumbs_Job';

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [jobListing, setJobListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchJobListing(id);
    }
  }, [id]);

  const fetchJobListing = async (jobId) => {
    setLoading(true);
    try {
      const query = `
      query JobListing($where: JobListingWhereUniqueInput!) {
        jobListing(where: $where) {
          id
          business {
            id
            name
          }
          title
          description
          salary
          location
        }
      }`;

      const variables = {
        where: { id: jobId },
      };

      const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        setError('Failed to fetch job listing');
        setLoading(false);
        return;
      }

      setJobListing(result.data.jobListing);
      setLoading(false);
    } catch (error) {
      setError('Error fetching job listing');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!jobListing) {
    return <div className="text-center text-red-500 mt-10">Job Listing Not Found</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      {/* Breadcrumbs */}
      <Breadcrumbs_Job
        businessName={jobListing.business.name}
        jobTitle={jobListing.title}
        businessId={jobListing.business.id}
      />

      {/* Job Listing Details */}
      <h1 className="text-3xl font-bold mb-4">{jobListing.title}</h1>
      <p className="text-lg mb-2"><strong>Business:</strong> {jobListing.business.name}</p>
      <p className="text-lg mb-2"><strong>Description:</strong> {jobListing.description}</p>
      <p className="text-lg mb-2"><strong>Salary:</strong> ${jobListing.salary}</p>
      <p className="text-lg mb-2"><strong>Location:</strong> {jobListing.location}</p>

      {/* Optional: Add any buttons or links to apply for the job */}
      <div className="mt-6">
        <a
          href="/apply"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}
