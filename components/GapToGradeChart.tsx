
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { GapToGradeData } from '../types';

interface GapToGradeChartProps {
  title: string;
  data: GapToGradeData[];
}

export const GapToGradeChart: React.FC<GapToGradeChartProps> = ({ title, data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'rgba(209, 213, 219, 0.3)' }} />
            <Bar dataKey="Students" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={30}>
                <LabelList dataKey="Students" position="top" style={{ fill: '#374151', fontSize: '12px' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
