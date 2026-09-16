export type Stock = {
  id: number;
  ticker: string;
  name: string;
};

export type StockDay = {
  id: number;
  date: string;
  stock: number;
  open_price: string;
  close_price: string;
  high_price: string;
  low_price: string;
  volume: number;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');

export async function fetchStocks(): Promise<Stock[]> {
  const response = await fetch(`${API_BASE_URL}/stocks/`);
  if (!response.ok) {
    throw new Error('Failed to fetch stocks.');
  }
  return response.json();
}

export async function fetchStockHistory(ticker: string): Promise<StockDay[]> {
  const response = await fetch(`${API_BASE_URL}/stocks/${ticker}/history`);
  if (!response.ok) {
    throw new Error(`Failed to fetch history for ${ticker}.`);
  }
  return response.json();
}
