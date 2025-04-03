import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';

interface TimeSeriesChartProps {
  data?: any[];
  isLoading?: boolean;
}

export default function TimeSeriesChart({ data, isLoading = false }: TimeSeriesChartProps) {
  const [timeRange, setTimeRange] = useState('30');
  const [chartType, setChartType] = useState('area');
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  
  // Sample data for demonstration (3 months of weekly data)
  const sampleData = data || [
    { week: 'Week 1', banditry: 12, militancy: 8, farmerHerder: 20, political: 10 },
    { week: 'Week 2', banditry: 15, militancy: 10, farmerHerder: 18, political: 12 },
    { week: 'Week 3', banditry: 13, militancy: 9, farmerHerder: 22, political: 15 },
    { week: 'Week 4', banditry: 18, militancy: 7, farmerHerder: 25, political: 11 },
    { week: 'Week 5', banditry: 20, militancy: 12, farmerHerder: 28, political: 14 },
    { week: 'Week 6', banditry: 16, militancy: 15, farmerHerder: 30, political: 16 },
    { week: 'Week 7', banditry: 14, militancy: 14, farmerHerder: 24, political: 18 },
    { week: 'Week 8', banditry: 12, militancy: 10, farmerHerder: 26, political: 22 },
    { week: 'Week 9', banditry: 10, militancy: 8, farmerHerder: 28, political: 20 },
    { week: 'Week 10', banditry: 9, militancy: 6, farmerHerder: 32, political: 18 },
    { week: 'Week 11', banditry: 8, militancy: 7, farmerHerder: 30, political: 16 },
    { week: 'Week 12', banditry: 10, militancy: 9, farmerHerder: 29, political: 14 },
  ];

  // Animation effect
  useEffect(() => {
    const finalData = sampleData;
    let displayData: any[] = [];
    
    // Calculate number of items to show based on timeRange
    const timeInWeeks = parseInt(timeRange) / 7;
    const dataToShow = finalData.slice(-timeInWeeks);
    
    // Use animation stages
    const stages = 15;
    let currentStage = 0;
    let timer: NodeJS.Timeout;
    
    // Reset animation data
    setAnimatedData([]);
    
    const animateData = () => {
      if (currentStage <= stages) {
        // Progressively add data points
        const itemsToShow = Math.ceil((dataToShow.length * currentStage) / stages);
        displayData = dataToShow.slice(0, itemsToShow).map(item => {
          // Also animate the values
          const factor = currentStage / stages;
          return {
            ...item,
            banditry: Math.floor(item.banditry * factor),
            militancy: Math.floor(item.militancy * factor),
            farmerHerder: Math.floor(item.farmerHerder * factor),
            political: Math.floor(item.political * factor)
          };
        });
        
        setAnimatedData(displayData);
        currentStage++;
        timer = setTimeout(animateData, 50);
      } else {
        setAnimatedData(dataToShow);
      }
    };
    
    animateData();
    
    return () => {
      clearTimeout(timer);
    };
  }, [timeRange, chartType, sampleData]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded shadow-md">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={`item-${index}`} 
              className="text-sm" 
              style={{ color: entry.color }}
            >
              {`${entry.name}: ${entry.value} incidents`}
            </p>
          ))}
          <hr className="my-2 border-neutral-200" />
          <p className="text-xs text-neutral-500">
            Total: {payload.reduce((sum: number, item: any) => sum + item.value, 0)} incidents
          </p>
        </div>
      );
    }
    return null;
  };
  
  const renderThresholdValue = () => {
    const thresholdValue = 25;
    return (
      <ReferenceLine 
        y={thresholdValue} 
        label={{ 
          value: 'Alert Threshold', 
          position: 'top', 
          fill: '#D8315B',
          fontSize: 12 
        }} 
        stroke="#D8315B" 
        strokeDasharray="3 3" 
      />
    );
  };
  
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart
            data={animatedData}
            margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12, fill: '#627D98' }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#627D98' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 15 }} />
            {renderThresholdValue()}
            <Line 
              type="monotone" 
              dataKey="banditry" 
              name="Banditry" 
              stroke="#0A2463" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#0A2463', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="militancy" 
              name="Militancy" 
              stroke="#3E92CC" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#3E92CC', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="farmerHerder" 
              name="Farmer-Herder" 
              stroke="#D8315B" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#D8315B', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="political" 
              name="Political" 
              stroke="#1B998B" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#1B998B', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        );
        
      case 'area':
        return (
          <AreaChart
            data={animatedData}
            margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorBanditry" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A2463" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0A2463" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorMilitancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3E92CC" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3E92CC" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorFarmerHerder" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D8315B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#D8315B" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPolitical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B998B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1B998B" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12, fill: '#627D98' }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#627D98' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 15 }} />
            {renderThresholdValue()}
            <Area 
              type="monotone" 
              dataKey="banditry" 
              name="Banditry" 
              stroke="#0A2463" 
              fillOpacity={1}
              fill="url(#colorBanditry)"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Area 
              type="monotone" 
              dataKey="militancy" 
              name="Militancy" 
              stroke="#3E92CC" 
              fillOpacity={1}
              fill="url(#colorMilitancy)"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Area 
              type="monotone" 
              dataKey="farmerHerder" 
              name="Farmer-Herder" 
              stroke="#D8315B" 
              fillOpacity={1}
              fill="url(#colorFarmerHerder)"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Area 
              type="monotone" 
              dataKey="political" 
              name="Political" 
              stroke="#1B998B" 
              fillOpacity={1}
              fill="url(#colorPolitical)"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        );
        
      case 'composed':
        return (
          <ComposedChart
            data={animatedData}
            margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12, fill: '#627D98' }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#627D98' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 15 }} />
            {renderThresholdValue()}
            <Area 
              type="monotone" 
              dataKey="banditry" 
              name="Banditry" 
              fill="url(#colorBanditry)"
              stroke="#0A2463"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="militancy" 
              name="Militancy" 
              stroke="#3E92CC"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#3E92CC', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Area 
              type="monotone" 
              dataKey="farmerHerder" 
              name="Farmer-Herder" 
              fill="url(#colorFarmerHerder)"
              stroke="#D8315B"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="political" 
              name="Political" 
              stroke="#1B998B"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#1B998B', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </ComposedChart>
        );
        
      default:
        return (
          <LineChart
            data={animatedData}
            margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12, fill: '#627D98' }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#627D98' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 15 }} />
            {renderThresholdValue()}
            <Line 
              type="monotone" 
              dataKey="banditry" 
              name="Banditry" 
              stroke="#0A2463" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#0A2463', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="militancy" 
              name="Militancy" 
              stroke="#3E92CC" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#3E92CC', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="farmerHerder" 
              name="Farmer-Herder" 
              stroke="#D8315B" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#D8315B', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="political" 
              name="Political" 
              stroke="#1B998B" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#1B998B', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        );
    }
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b border-neutral-100 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Incident Trends Over Time</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="text-sm border border-neutral-200 rounded h-8 px-2 py-1 w-[120px]">
                <SelectValue placeholder="Chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="composed">Mixed Chart</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="text-sm border border-neutral-200 rounded h-8 px-2 py-1 w-[140px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="60">Last 60 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-primary">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-primary">
            <Calendar className="h-4 w-4" />
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
              {renderChart()}
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-neutral-50 rounded border-l-4 border-accent">
          <h4 className="text-sm font-medium text-neutral-700">Alert: Critical Trend Detected</h4>
          <p className="text-sm text-neutral-600 mt-1">
            Farmer-Herder conflicts have exceeded the alert threshold (25 incidents/week) for 8 consecutive weeks. 
            Immediate coordination with response agencies in affected regions is recommended.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}