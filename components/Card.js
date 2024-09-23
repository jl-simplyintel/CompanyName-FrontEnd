// components\Card.js
import React from 'react';

const Card = ({ business }) => {
  return (
    <button className="card-floating p-3 bg-white rounded-lg transform hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out cursor-pointer h-48 w-full text-left z-0">
      <h3 className="text-xl font-semibold text-blue-600 mb-2">{business.name}</h3>
      <p className="text-sm text-gray-700 mb-1">{business.contactEmail}</p>
      <p className="text-sm text-gray-700 mb-1">{business.contactPhone}</p>
      <p className="text-sm text-gray-700">{business.location}</p>
    </button>
  );
};

export default Card;
