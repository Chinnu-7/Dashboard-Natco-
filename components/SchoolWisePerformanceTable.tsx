import React, { useState, useMemo } from 'react';
import type { SchoolPerformance } from '../types';

interface SchoolWisePerformanceTableProps {
  schools: SchoolPerformance[];
}

const ITEMS_PER_PAGE = 7;

export const SchoolWisePerformanceTable: React.FC<SchoolWisePerformanceTableProps> = ({ schools }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedSchools = useMemo(() => {
    return [...schools].sort((a, b) => b.participationRate - a.participationRate);
  }, [schools]);

  const totalPages = Math.ceil(sortedSchools.length / ITEMS_PER_PAGE);

  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedSchools.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedSchools, currentPage]);
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">School-Wise Performance</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participation Rate</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg English Perf. (Years Beyond)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Math Perf. (Years Beyond)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedSchools.map((school, index) => (
              <tr key={school.schoolName + index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{school.schoolName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.districtName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">{school.participationRate.toFixed(1)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.avgEnglishPerformance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.avgMathPerformance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
         {paginatedSchools.length === 0 && (
            <div className="text-center py-8 text-gray-500">No schools found for the selected filters.</div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
      )}
    </div>
  );
};