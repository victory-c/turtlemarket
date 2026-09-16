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
let stocksPromise: Promise<Stock[]> | null = null;
const historyPromises = new Map<string, Promise<StockDay[]>>();

export async function fetchStocks(): Promise<Stock[]> {
  if (!stocksPromise) {
    stocksPromise = (async () => {
      const response = await fetch(`${API_BASE_URL}/stocks/`);
      if (!response.ok) {
        throw new Error('Failed to fetch stocks.');
      }
      return response.json();
    })();
  }

  try {
    return await stocksPromise;
  } catch (error) {
    stocksPromise = null;
    throw error;
  }
}

export async function fetchStockHistory(ticker: string): Promise<StockDay[]> {
  if (!historyPromises.has(ticker)) {
    historyPromises.set(
      ticker,
      (async () => {
        const response = await fetch(`${API_BASE_URL}/stocks/${ticker}/history`);
        if (!response.ok) {
          throw new Error(`Failed to fetch history for ${ticker}.`);
        }
        return response.json();
      })(),
    );
  }

  try {
    return await historyPromises.get(ticker)!;
  } catch (error) {
    historyPromises.delete(ticker);
    throw error;
  }
}
