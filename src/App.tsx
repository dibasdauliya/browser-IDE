import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, PythonIDE } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/python" element={<PythonIDE />} />
      </Routes>
    </Router>
  );
}

export default App;
