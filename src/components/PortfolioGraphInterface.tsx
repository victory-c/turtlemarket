import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const prices: Record<string, number[]> = {
  'AAPL': [308.26, 304.91, 302.25, 305.26, 305.93],
  'GOOG': [355.84, 343.00, 342.37, 343.94, 343.54],
  'JNJ': [261.81, 259.80, 260.86, 262.08, 260.35],
  'SHEL': [89.95, 90.50, 90.07, 89.92, 90.47],
}

const dates = [
  new Date("2026-08-11"),
  new Date("2026-08-12"),
  new Date("2026-08-13"),
  new Date("2026-08-14"),
  new Date("2026-08-15"),
]

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 30,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

function PortfolioGraphInterface() {
  return (
    <div className="h-1/2 w-9/10 flex flex-wrap justify-around content-center">
      <div className="w-1/3">
        <LineChart 
          series={[
            { data: prices['AAPL'], label: 'AAPL', showMark: true, shape: 'circle', color: 'red' },
          ]}
          xAxis={[{ 
            scaleType: 'point', 
            data: dates, 
            tickInterval: dates, 
            valueFormatter: (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }]}
          grid={{ vertical: true, horizontal: true }}
        />
      </div>
      <div className="w-1/3 h-4/5">
        <PieChart 
          series={[
            {
              data: [
                { id: 0, value: 500, label: 'AAPL', color: 'red' },
                { id: 1, value: 500, label: 'GOOG', color: 'green' },
                { id: 2, value: 250, label: 'JNJ', color: 'orange' },
                { id: 3, value: 150, label: 'SHEL', color: 'yellow' },
              ],
              innerRadius: '60%',
            }
          ]}>
            <PieCenterLabel>Portfolio</PieCenterLabel>
          </PieChart>
      </div>
      <div className="w-1/3">
        <LineChart 
          series={[
            { data: prices['GOOG'], label: 'GOOG', showMark: true, shape: 'circle', color: 'green' },
          ]}
          xAxis={[{ 
            scaleType: 'point', 
            data: dates, 
            tickInterval: dates, 
            valueFormatter: (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }]}
          grid={{ vertical: true, horizontal: true }}
        />
      </div>
    </div>
    
  )
}

export default PortfolioGraphInterface;

