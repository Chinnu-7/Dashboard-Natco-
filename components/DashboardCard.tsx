
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full text-center">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
};
