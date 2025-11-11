
import React, { useState, useMemo } from 'react';
// Fix: The type 'Student' is not exported from '../types'. Changed to 'StudentDetail' which is the correct type for student data.
import type { StudentDetail } from '../types';

interface StudentDetailsTableProps {
  students: StudentDetail[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ITEMS_PER_PAGE = 7;

export const StudentDetailsTable: React.FC<StudentDetailsTableProps> = ({ students, searchTerm, setSearchTerm }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return students.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [students, currentPage]);
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
          }}
          className="mt-2 sm:mt-0 w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['District', 'School Id', 'School Name', 'LoginId', 'Student Name', 'Grade', 'English Level', 'Math Level'].map(header => (
                 <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                 </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStudents.map((student, index) => (
              <tr key={student.loginId + index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.district}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.schoolId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.schoolName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.loginId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.englishLevel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.mathLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginatedStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">No students found.</div>
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