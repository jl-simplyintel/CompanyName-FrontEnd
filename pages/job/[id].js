import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// Fetch data using getServerSideProps
export async function getServerSideProps(context) {
  const { id } = context.query;

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
    }
  `;

  const variables = {
    where: { id },
  };

  const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    return {
      notFound: true, // Handle not found case
    };
  }

  return {
    props: {
      jobListing: result.data.jobListing || null,
    },
  };
}

export default function JobDetail({ jobListing }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>; // Optional: can handle fallback loading state here
  }

  if (!jobListing) {
    return <div>Job Listing Not Found</div>; // Handle case when job listing is not found
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">{jobListing.title}</h1>
      <p className="text-lg mb-4">Business: {jobListing.business?.name}</p>
      <p className="text-lg mb-4">Description: {jobListing.description}</p>
      <p className="text-lg mb-4">Salary: ${jobListing.salary}</p>
      <p className="text-lg mb-4">Location: {jobListing.location}</p>
    </div>
  );
}
