import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { fetchStockHistory, fetchStocks, type StockDay } from '../api';

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

function parseLocalDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function PortfolioGraphInterface() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [historyByTicker, setHistoryByTicker] = useState<Record<string, StockDay[]>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const stocks = await fetchStocks();
        const selected = stocks.slice(0, 4).map((stock) => stock.ticker);
        const histories = await Promise.all(
          selected.map(async (ticker) => [ticker, await fetchStockHistory(ticker)] as const),
        );
        setTickers(selected);
        setHistoryByTicker(Object.fromEntries(histories));
      } catch {
        setTickers([]);
        setHistoryByTicker({});
      }
    };

    void loadData();
  }, []);

  const chartTickers = useMemo(() => tickers.slice(0, 2), [tickers]);
  const firstTicker = chartTickers[0];
  const secondTicker = chartTickers[1];
  const firstHistory = firstTicker ? historyByTicker[firstTicker] ?? [] : [];
  const secondHistory = secondTicker ? historyByTicker[secondTicker] ?? [] : [];
  const firstDates = firstHistory.map((entry) => parseLocalDate(entry.date)).reverse();
  const secondDates = secondHistory.map((entry) => parseLocalDate(entry.date)).reverse();
  const firstPrices = firstHistory.map((entry) => Number(entry.close_price)).reverse();
  const secondPrices = secondHistory.map((entry) => Number(entry.close_price)).reverse();
  const pieData = tickers.map((ticker, index) => ({
    id: index,
    label: ticker,
    value: Number(historyByTicker[ticker]?.[0]?.close_price ?? 0),
  }));

  return (
    <div className="h-1/2 w-9/10 flex flex-wrap justify-around content-center">
      <div className="w-1/3">
        <LineChart 
          series={[
            { data: firstPrices, label: firstTicker ?? 'No data', showMark: true, shape: 'circle', color: 'red' },
          ]}
          xAxis={[{ 
            scaleType: 'point', 
            data: firstDates, 
            tickInterval: firstDates, 
            valueFormatter: (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }]}
          grid={{ vertical: true, horizontal: true }}
        />
      </div>
      <div className="w-1/3 h-4/5">
        <PieChart 
          series={[
            {
              data: pieData,
              innerRadius: '60%',
            }
          ]}>
            <PieCenterLabel>Portfolio</PieCenterLabel>
          </PieChart>
      </div>
      <div className="w-1/3">
        <LineChart 
          series={[
            { data: secondPrices, label: secondTicker ?? 'No data', showMark: true, shape: 'circle', color: 'green' },
          ]}
          xAxis={[{ 
            scaleType: 'point', 
            data: secondDates, 
            tickInterval: secondDates, 
            valueFormatter: (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }]}
          grid={{ vertical: true, horizontal: true }}
        />
      </div>
    </div>
    
  )
}

export default PortfolioGraphInterface;
