import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface OverallParticipationProps {
  total: number;
  participated: number;
}

export const OverallParticipation: React.FC<OverallParticipationProps> = ({ total, participated }) => {
  const percentage = total > 0 ? (participated / total) * 100 : 0;
  const data = [
    { name: 'Not Participated', value: 100 - percentage },
    { name: 'Participated', value: percentage },
  ];

  const COLORS = ['#e0f2f1', '#0d9488']; // light, dark

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Overall Participation</h3>
      <div className="w-full h-40 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 text-center">
            <p className="text-3xl font-bold text-brand-dark">{percentage.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">{`${participated} / ${total}`}</p>
        </div>
      </div>
    </div>
  );
};