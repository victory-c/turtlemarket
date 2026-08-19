import PortfolioGraphSection from "./components/PortfolioGraphInterface";
import StockDataGrid from "./components/StockDataGrid";

function App() {
  return (
    <div className="h-dvh w-screen flex flex-wrap justify-center content-around">
      <PortfolioGraphSection />
      <StockDataGrid />
    </div>
  )
}

export default App
