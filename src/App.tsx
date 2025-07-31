import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  PythonIDE,
  HTMLPlayground,
  BackendPythonIDE,
  CIDE,
} from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/python" element={<PythonIDE />} />
        <Route path="/python-backend" element={<BackendPythonIDE />} />
        <Route path="/web" element={<HTMLPlayground />} />
        <Route path="/c" element={<CIDE />} />
      </Routes>
    </Router>
  );
}

export default App;
