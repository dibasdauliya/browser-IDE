import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, PythonIDE, HTMLPlayground } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/python" element={<PythonIDE />} />
        <Route path="/web" element={<HTMLPlayground />} />
      </Routes>
    </Router>
  );
}

export default App;
