import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, MoreVertical, ChevronUp, ChevronDown, Info, ZoomIn, ZoomOut, RefreshCw, Filter } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend,
  LabelList,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
  PieChart,
  Pie
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CrisisChartProps {
  data?: any[];
  isLoading?: boolean;
}

export default function CrisisChart({ data, isLoading = false }: CrisisChartProps) {
  const [timeRange, setTimeRange] = useState('30');
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [chartView, setChartView] = useState('incidents');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'composed' | 'pie'>('bar');
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number[]>([100]);
  const [showLabels, setShowLabels] = useState(true);
  const [showAnimation, setShowAnimation] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false);
  const [highlightThreshold, setHighlightThreshold] = useState(25);
  const chartRef = useRef<any>(null);
  
  // Sample data for demonstration
  const baseChartData = data || [
    { name: 'Banditry', count: 24, lastMonth: 26, percent: 15, fill: '#0A2463' },
    { name: 'Militancy', count: 18, lastMonth: 14, percent: 11, fill: '#0A2463' },
    { name: 'Farmer-Herder', count: 32, lastMonth: 28, percent: 20, fill: '#D8315B' },
    { name: 'Political', count: 22, lastMonth: 18, percent: 14, fill: '#0A2463' },
    { name: 'Boundary', count: 15, lastMonth: 12, percent: 9, fill: '#0A2463' },
    { name: 'Communal', count: 29, lastMonth: 22, percent: 18, fill: '#D8315B' },
    { name: 'Other', count: 12, lastMonth: 10, percent: 7, fill: '#0A2463' }
  ];
  
  const trendData = [
    { type: 'Farmer-Herder Conflicts', value: '+12%', trend: 'increasing' },
    { type: 'Banditry Incidents', value: '-8%', trend: 'decreasing' },
    { type: 'Political Unrest', value: '+23%', trend: 'increasing' }
  ];

  const locationData = [
    { name: 'Benue', count: 45, fill: '#D8315B' },
    { name: 'Kaduna', count: 38, fill: '#D8315B' },
    { name: 'Plateau', count: 29, fill: '#0A2463' },
    { name: 'Zamfara', count: 35, fill: '#D8315B' },
    { name: 'Katsina', count: 27, fill: '#0A2463' },
    { name: 'Borno', count: 31, fill: '#0A2463' },
    { name: 'Delta', count: 22, fill: '#0A2463' }
  ];
  
  // Animation effect
  useEffect(() => {
    // Animation stages for data
    const chartData = chartView === 'incidents' ? baseChartData : locationData;
    const stages = 20;
    let timer: NodeJS.Timeout;
    let currentStage = 0;
    
    // Reset animation
    setAnimatedData([]);
    
    const animateData = () => {
      if (currentStage <= stages) {
        const newData = chartData.map(item => {
          const factor = currentStage / stages;
          return {
            ...item,
            count: Math.floor(item.count * factor),
            lastMonth: item.lastMonth ? Math.floor(item.lastMonth * factor) : undefined,
            percent: item.percent ? Math.floor(item.percent * factor) : undefined,
          };
        });
        setAnimatedData(newData);
        currentStage++;
        timer = setTimeout(animateData, 30);
      } else {
        setAnimatedData(chartData);
      }
    };
    
    animateData();
    
    return () => {
      clearTimeout(timer);
    };
  }, [chartView, timeRange, baseChartData, locationData]);
  
  const handleBarClick = (data: any, index: number) => {
    setActiveBar(activeBar === index ? null : index);
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-neutral-700">{`Current: ${payload[0].value}`}</p>
          {payload[0].payload.lastMonth && (
            <p className="text-sm text-neutral-500">
              {`Last month: ${payload[0].payload.lastMonth}`}
              {payload[0].payload.lastMonth < payload[0].value ? (
                <span className="text-danger ml-1">↑ {Math.round((payload[0].value - payload[0].payload.lastMonth) / payload[0].payload.lastMonth * 100)}%</span>
              ) : (
                <span className="text-success ml-1">↓ {Math.round((payload[0].payload.lastMonth - payload[0].value) / payload[0].payload.lastMonth * 100)}%</span>
              )}
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b border-neutral-100 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Crisis Trend Analysis</CardTitle>
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
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-primary">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-primary">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="h-80 bg-neutral-100 animate-pulse flex items-center justify-center rounded">
            <div className="text-neutral-400">Loading chart data...</div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <Tabs defaultValue="incidents" value={chartView} onValueChange={setChartView}>
                <TabsList className="bg-neutral-100">
                  <TabsTrigger value="incidents" className="text-sm">By Incident Type</TabsTrigger>
                  <TabsTrigger value="locations" className="text-sm">By Location</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-2">
                {/* Chart Type Selector */}
                <Select value={chartType} onValueChange={(val: any) => setChartType(val)}>
                  <SelectTrigger className="h-8 w-[110px] text-xs">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="composed">Combined</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Chart Controls */}
                <div className="flex space-x-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoomLevel([Math.min(zoomLevel[0] + 20, 200)])}>
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoomLevel([Math.max(zoomLevel[0] - 20, 30)])}>
                    <ZoomOut className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAnimatedData([])}>
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  
                  {/* Chart Options */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Filter className="h-3.5 w-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="end">
                      <h4 className="font-medium text-sm mb-2">Chart Options</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-labels" className="text-xs">Show Labels</Label>
                          <Switch 
                            id="show-labels" 
                            checked={showLabels} 
                            onCheckedChange={setShowLabels}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-animation" className="text-xs">Animations</Label>
                          <Switch 
                            id="show-animation" 
                            checked={showAnimation} 
                            onCheckedChange={setShowAnimation}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="highlight-threshold" className="text-xs">Highlight Threshold</Label>
                            <span className="text-xs font-medium">{highlightThreshold}</span>
                          </div>
                          <Slider 
                            id="highlight-threshold"
                            min={0} 
                            max={50} 
                            step={1}
                            value={[highlightThreshold]}
                            onValueChange={(value) => setHighlightThreshold(value[0])}
                          />
                        </div>
                        <div className="pt-2">
                          <Button 
                            size="sm" 
                            className="w-full text-xs"
                            variant={isFiltered ? "default" : "outline"}
                            onClick={() => {
                              setIsFiltered(!isFiltered);
                              if (!isFiltered) {
                                // Filter data with count above threshold
                                const filteredData = (chartView === 'incidents' ? baseChartData : locationData)
                                  .filter(item => item.count > highlightThreshold);
                                setAnimatedData(filteredData);
                              } else {
                                // Reset to all data
                                setAnimatedData(chartView === 'incidents' ? baseChartData : locationData);
                              }
                            }}
                          >
                            {isFiltered ? "Clear Filter" : "Apply Filter"}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="h-80 relative">
              <ResponsiveContainer width={`${zoomLevel[0]}%`} height="100%" className="mx-auto transition-all duration-300">
                {chartType === 'bar' && (
                  <BarChart
                    data={animatedData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    barGap={8}
                    barCategoryGap={20}
                    ref={chartRef}
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0A2463" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#0A2463" stopOpacity={0.7}/>
                      </linearGradient>
                      <linearGradient id="barGradientHighlight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D8315B" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#D8315B" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
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
                    <Legend wrapperStyle={{ marginTop: 10 }} />
                    <Bar 
                      dataKey="count" 
                      name="Incidents" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={showAnimation ? 900 : 0}
                      animationEasing="ease-in-out"
                      onClick={handleBarClick}
                    >
                      {animatedData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={activeBar === index || entry.count > highlightThreshold ? 'url(#barGradientHighlight)' : (entry.fill || 'url(#barGradient)')}
                          stroke={activeBar === index ? '#D8315B' : 'transparent'}
                          strokeWidth={activeBar === index ? 2 : 0}
                          cursor="pointer"
                        />
                      ))}
                      {showLabels && (
                        <LabelList 
                          dataKey="count" 
                          position="top" 
                          fill="#666" 
                          fontSize={11}
                          offset={5}
                        />
                      )}
                    </Bar>
                  </BarChart>
                )}
                
                {chartType === 'line' && (
                  <LineChart
                    data={animatedData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    ref={chartRef}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
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
                    <Legend wrapperStyle={{ marginTop: 10 }} />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name="Incidents" 
                      stroke="#0A2463"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#0A2463", stroke: "#0A2463" }}
                      activeDot={{ r: 6, fill: "#D8315B", stroke: "#fff" }}
                      animationDuration={showAnimation ? 1500 : 0}
                    />
                    {showLabels && (
                      <LabelList 
                        dataKey="count" 
                        position="top" 
                        fill="#666" 
                        fontSize={11}
                        offset={10}
                      />
                    )}
                  </LineChart>
                )}
                
                {chartType === 'area' && (
                  <AreaChart
                    data={animatedData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    ref={chartRef}
                  >
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0A2463" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0A2463" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
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
                    <Legend wrapperStyle={{ marginTop: 10 }} />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      name="Incidents" 
                      stroke="#0A2463"
                      fill="url(#areaGradient)"
                      animationDuration={showAnimation ? 1500 : 0}
                    />
                  </AreaChart>
                )}
                
                {chartType === 'pie' && (
                  <PieChart ref={chartRef}>
                    <Pie
                      data={animatedData}
                      cx="50%"
                      cy="50%"
                      labelLine={showLabels}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#0A2463"
                      dataKey="count"
                      nameKey="name"
                      animationDuration={showAnimation ? 900 : 0}
                      label={showLabels ? ({name, count}) => `${name}: ${count}` : false}
                    >
                      {animatedData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.count > highlightThreshold ? '#D8315B' : '#0A2463'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                )}
                
                {chartType === 'composed' && (
                  <ComposedChart
                    data={animatedData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    ref={chartRef}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
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
                    <Legend wrapperStyle={{ marginTop: 10 }} />
                    <Bar 
                      dataKey="count" 
                      name="Incidents" 
                      radius={[4, 4, 0, 0]} 
                      barSize={20}
                      fill="#0A2463"
                      animationDuration={showAnimation ? 900 : 0}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lastMonth" 
                      name="Last Month" 
                      stroke="#D8315B"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      animationDuration={showAnimation ? 1500 : 0}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
              
              {zoomLevel[0] > 100 && (
                <div className="absolute bottom-1 right-1 opacity-50 text-xs">
                  {zoomLevel[0]}% zoom
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {trendData.map((item, index) => (
            <div 
              key={index} 
              className="bg-neutral-50 p-3 rounded border border-transparent hover:border-neutral-200 transition-all transform hover:translate-y-[-2px] hover:shadow-sm"
            >
              <h4 className="text-sm font-medium text-neutral-700">{item.type}</h4>
              <p className="text-lg font-semibold mt-1">{item.value}</p>
              <div className={`mt-1 text-xs flex items-center ${
                item.trend === 'increasing' ? 'text-danger' : 'text-success'
              }`}>
                {item.trend === 'increasing' ? (
                  <ChevronUp className="mr-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="mr-1 h-3 w-3" />
                )}
                {item.trend === 'increasing' ? 'Increasing' : 'Decreasing'}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-neutral-50 rounded border-l-4 border-primary">
          <h4 className="text-sm font-medium text-neutral-700">Analysis Insight</h4>
          <p className="text-sm text-neutral-600 mt-1">
            {chartView === 'incidents' ? 
              'Farmer-Herder conflicts have increased by 12% compared to the previous month, while Banditry incidents show a decreasing trend. Political unrest is increasing rapidly and requires close monitoring.' :
              'Benue state has the highest concentration of incidents, followed by Kaduna and Zamfara. Consider targeted interventions in these hotspot regions.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
