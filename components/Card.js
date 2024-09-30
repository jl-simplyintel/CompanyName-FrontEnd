// components\Card.js
import React from 'react';

const Card = ({ business }) => {
  const renderStars = (averageRating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starFill = averageRating - index;
      if (starFill >= 1) {
        return <i key={index} className="bi bi-star-fill text-yellow-500"></i>; // Full star
      } else if (starFill >= 0.5) {
        return <i key={index} className="bi bi-star-half text-yellow-500"></i>; // Half star
      } else {
        return <i key={index} className="bi bi-star text-yellow-500"></i>; // Empty star
      }
    });
  };

  return (
    <div className="card-floating p-3 bg-white rounded-lg transform hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out cursor-pointer h-48 w-full text-left z-0">
      <h3 className="text-xl font-semibold text-blue-600 mb-2">{business.name}</h3>
      <p className="text-sm text-gray-700 mb-1">{business.contactEmail}</p>
      <p className="text-sm text-gray-700 mb-1">{business.contactPhone}</p>
      <p className="text-sm text-gray-700">{business.location}</p>
      <div className="mt-2">
        <div className="flex items-center">
          {renderStars(business.averageRating)}
          <span className="ml-2 text-gray-600">{business.averageRating}/5</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
