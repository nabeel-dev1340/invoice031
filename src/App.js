import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import InvoiceForm from "./pages/InvoiceForm";
import SearchOrder from "./pages/SearchOrder";
import WorkOrder from "./pages/WorkOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/invoice-form" element={<InvoiceForm />} />
        <Route path="/search-order" element={<SearchOrder />} />
        <Route path="/work-order" element={<WorkOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
