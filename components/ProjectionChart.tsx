import React from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProjectedBalance } from '../types';
import { CURRENCY_SYMBOL, CHART_COLORS } from '../constants';
import { formatDisplayDate } from '../utils/dateUtils';

interface ProjectionChartProps {
  projections: ProjectedBalance[];
  simpleMode?: boolean; // For the dashboard's simpler chart
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ projections, simpleMode = false }) => {
  if (!projections.length) {
    return <div className="flex items-center justify-center h-full text-slate-500">No data for chart.</div>;
  }
  
  // For simple mode, we might want to show fewer ticks or aggregate data by month
  // For now, we'll use all data points but simplify the visual presentation.
  // Aggregate data by month for the simple chart if many data points exist
    let dataForChart;
    if (simpleMode && projections.length > 30) { // Aggregate if more than 30 days
        const monthlyData: { [key: string]: { name: string, SaldoProjetado: number, count: number } } = {};
        projections.forEach(p => {
            const monthYear = formatDisplayDate(p.date, 'monthYearOnly');
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = { name: monthYear, SaldoProjetado: 0, count: 0 };
            }
            monthlyData[monthYear].SaldoProjetado += p.balance;
            monthlyData[monthYear].count += 1;
        });
        dataForChart = Object.values(monthlyData).map(m => ({
            name: m.name,
            // Average balance for the month, or last day's balance might be better.
            // For simplicity, let's use the sum now, which isn't ideal for balance.
            // Let's take the balance of the first entry for that month for simplicity of aggregation
            SaldoProjetado: projections.find(p => formatDisplayDate(p.date, 'monthYearOnly') === m.name)?.balance || 0,
        })).slice(0, 3); // Show roughly 3 months
    } else {
       dataForChart = projections.map(p => ({
        name: formatDisplayDate(p.date, 'dayMonthShort'),
        SaldoProjetado: p.balance,
      }));
    }


  const CustomTooltipContent: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2.5 shadow-lg rounded-md border border-slate-200">
          <p className="text-sm font-medium text-slate-700">{`${label}`}</p>
          <p style={{ color: CHART_COLORS.projectedLine }} className="text-sm">
            {`Balance: ${CURRENCY_SYMBOL} ${payload[0].value.toFixed(2)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (simpleMode) {
    // FinTrack dashboard chart style
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={dataForChart}
          margin={{ top: 5, right: 0, left: -30, bottom: 0 }} // Adjusted margins
        >
          <defs>
            <linearGradient id="fintrackProjectionFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.projectedArea} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CHART_COLORS.projectedArea} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#94a3b8' }} // text-slate-400
            axisLine={false}
            tickLine={false}
            interval={Math.floor(dataForChart.length / 4)} // Show fewer ticks
          />
          <YAxis 
            tickFormatter={(value) => `${CURRENCY_SYMBOL}${Math.round(value / 1000)}k`} // 1k, 2k
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltipContent />} cursor={{ stroke: CHART_COLORS.projectedLine, strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Area 
            type="monotone" 
            dataKey="SaldoProjetado" 
            stroke={CHART_COLORS.projectedLine} 
            fill="url(#fintrackProjectionFill)" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: CHART_COLORS.projectedLine }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // Original detailed chart (can be used on a dedicated projections page)
  return (
    <div className="bg-white p-2 sm:p-4 shadow rounded-lg h-80 sm:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dataForChart}
          margin={{ top: 5, right: 10, left: -20, bottom: 20 }} // Increased bottom margin for angled labels
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#6B7280' }} 
            angle={-45} // Angle labels for better fit
            textAnchor="end" 
            height={50} // Increased height for angled labels
            interval="preserveStartEnd"
          />
          <YAxis 
            tickFormatter={(value) => `${CURRENCY_SYMBOL}${value}`} 
            tick={{ fontSize: 10, fill: '#6B7280' }}
            width={70}
          />
          <Tooltip content={<CustomTooltipContent />} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="SaldoProjetado" stroke={CHART_COLORS.projectedLine} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Saldo Projetado" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectionChart;
