
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface VisualizerProps {
  percentage: number;
  total: number;
}

const Visualizer: React.FC<VisualizerProps> = ({ percentage, total }) => {
  const safePercent = Math.min(Math.max(percentage, 0), 100);
  const data = [
    { name: 'Portion', value: safePercent },
    { name: 'Remaining', value: 100 - safePercent },
  ];

  const COLORS = ['#6366f1', '#e2e8f0'];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center -mt-36">
        <span className="text-2xl font-bold text-indigo-600">{safePercent.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default Visualizer;
