import { DataGrid, type GridRowsProp, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { fetchStockHistory, fetchStocks } from '../api';

const columns: GridColDef[] = [
  { field: 'ticker', headerName: 'Ticker', flex: 1 },
  { field: 'name', headerName: 'Company Name', flex: 5 },
  { field: 'dayChange', headerName: 'Day Change', flex: 2 },
  { field: 'price', headerName: 'Price at Close', flex: 2 },
]

function StockDataGrid() {
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stocks = await fetchStocks();
        const rowsWithPricing = await Promise.all(
          stocks.map(async (stock) => {
            const history = await fetchStockHistory(stock.ticker);
            if (history.length === 0) {
              return {
                id: stock.id,
                ticker: stock.ticker,
                name: stock.name,
                dayChange: 'N/A',
                price: 'N/A',
              };
            }

            const latestClose = Number(history[0]?.close_price ?? 0);
            const previousClose = Number(history[1]?.close_price ?? latestClose);
            const dayDelta = latestClose - previousClose;
            const dayDeltaPercent = previousClose === 0 ? 0 : (dayDelta / previousClose) * 100;

            return {
              id: stock.id,
              ticker: stock.ticker,
              name: stock.name,
              dayChange: `${dayDelta >= 0 ? '+' : ''}${dayDelta.toFixed(2)} (${dayDeltaPercent >= 0 ? '+' : ''}${dayDeltaPercent.toFixed(2)}%)`,
              price: `$${latestClose.toFixed(2)}`,
            };
          }),
        );
        setRows(rowsWithPricing);
      } catch {
        setRows([]);
      }
    };

    void loadData();
  }, []);

  return (
    <div className="w-3/5">
      <DataGrid columns={columns} rows={rows} />
    </div>
  )
}

export default StockDataGrid;