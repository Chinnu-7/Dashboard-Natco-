import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend } from 'recharts';
import type { GradeWiseParticipation } from '../types';

interface GradeWiseParticipationChartProps {
  data: GradeWiseParticipation[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
          <p className="font-bold">{`Grade ${label}`}</p>
          <p style={{ color: '#0d9488' }}>{`Registered: ${payload[0].value}`}</p>
          <p style={{ color: '#5eead4' }}>{`Participated: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
};

export const GradeWiseParticipationChart: React.FC<GradeWiseParticipationChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.grade.replace('Grade ', ''),
    Registered: item.registered,
    Participated: item.participated,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade-Wise Participation</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(209, 213, 219, 0.3)' }}/>
            <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
            <Bar dataKey="Registered" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={15}>
                <LabelList dataKey="Registered" position="top" style={{ fill: '#374151', fontSize: '10px' }} />
            </Bar>
            <Bar dataKey="Participated" fill="#5eead4" radius={[4, 4, 0, 0]} barSize={15}>
                <LabelList dataKey="Participated" position="top" style={{ fill: '#374151', fontSize: '10px' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
