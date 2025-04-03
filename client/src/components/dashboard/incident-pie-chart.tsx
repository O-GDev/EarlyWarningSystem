import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Info } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  Cell, 
  Tooltip, 
  Legend,
  Sector
} from 'recharts';

interface IncidentPieChartProps {
  data?: any[];
  isLoading?: boolean;
}

const INCIDENT_COLORS = [
  '#0A2463', // Deep Blue
  '#D8315B', // Red
  '#3E92CC', // Light Blue
  '#FF9F1C', // Orange
  '#1B998B', // Teal
  '#8E3B46', // Burgundy
  '#1E1E24', // Dark Grey
];

export default function IncidentPieChart({ data, isLoading = false }: IncidentPieChartProps) {
  const [timeRange, setTimeRange] = useState('30');
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Sample data for demonstration
  const pieData = data || [
    { name: 'Farmer-Herder', value: 32 },
    { name: 'Militancy', value: 24 },
    { name: 'Political', value: 22 },
    { name: 'Banditry', value: 18 },
    { name: 'Communal', value: 15 },
    { name: 'Religious', value: 12 },
    { name: 'Other', value: 8 }
  ];

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { 
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value 
    } = props;
    
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">
          {`${value} Incidents`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-neutral-700">{`Incidents: ${payload[0].value}`}</p>
          <p className="text-xs text-neutral-500">{`${(payload[0].payload.percent * 100).toFixed(2)}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b border-neutral-100 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Incident Types Distribution</CardTitle>
        <div className="flex items-center space-x-4">
          <div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="text-sm border border-neutral-200 rounded h-8 px-2 py-1 w-[140px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="180">Last 6 Months</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-primary">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-primary">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="h-[350px] bg-neutral-100 animate-pulse flex items-center justify-center rounded">
            <div className="text-neutral-400">Loading chart data...</div>
          </div>
        ) : (
          <div className="h-[350px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  innerRadius={85}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={INCIDENT_COLORS[index % INCIDENT_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Key Takeaways</h4>
          <p className="text-sm text-neutral-600">
            Farmer-Herder conflicts remain the most prevalent incident type at 32%, 
            followed by militancy and political violence. This distribution indicates 
            a need for targeted conflict resolution initiatives in agricultural zones.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}