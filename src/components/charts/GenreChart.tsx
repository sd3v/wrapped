import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { GenreData } from '../../types/spotify';

interface GenreChartProps {
  genres: GenreData[];
  limit?: number;
}

export function GenreChart({ genres, limit = 8 }: GenreChartProps) {
  const displayGenres = genres.slice(0, limit);
  const otherGenres = genres.slice(limit);
  
  const chartData = [
    ...displayGenres,
    ...(otherGenres.length > 0 ? [{
      name: 'Other',
      count: otherGenres.reduce((sum, g) => sum + g.count, 0),
      percentage: otherGenres.reduce((sum, g) => sum + g.percentage, 0),
      color: '#666666',
    }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Pie Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(_value, _name, props) => {
                const payload = props?.payload as GenreData | undefined;
                return payload ? [`${payload.percentage}%`, payload.name] : [];
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-sm text-spotify-light">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Genre List with bars */}
      <div className="space-y-3">
        {displayGenres.slice(0, 5).map((genre, index) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: genre.color }}
                />
                <span className="text-white font-medium">{genre.name}</span>
              </div>
              <span className="text-spotify-light">{genre.percentage}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: genre.color }}
                initial={{ width: 0 }}
                animate={{ width: `${genre.percentage}%` }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default GenreChart;

