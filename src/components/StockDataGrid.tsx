import { DataGrid, type GridRowsProp, type GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'ticker', headerName: 'Ticker', flex: 1 },
  { field: 'name', headerName: 'Company Name', flex: 5 },
  { field: 'dayChange', headerName: 'Day Change', flex: 2 },
  { field: 'price', headerName: 'Price at Close', flex: 2 },
]

const rows: GridRowsProp = [
  { id: 0, ticker: 'AAPL', name: 'Apple Inc', dayChange: '+0.67 (+0.22%)', price: '$305.93' },
  { id: 1, ticker: 'GOOG', name: 'Alphabet Inc Class C', dayChange: '-0.40 (-0.12%)', price: '$343.54' },
  { id: 2, ticker: 'JNJ', name: 'Johnson & Johnson', dayChange: '-1.73 (-0.66%)', price: '$260.35' },
  { id: 3, ticker: 'SHEL', name: 'Shell PLC', dayChange: '+1.33 (+1.49%)', price: '$90.47' },
]

function StockDataGrid() {
  return (
    <div style={{ width: '75%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  )
}

export default StockDataGrid;