import {Route, Routes} from 'react-router-dom';
import MainPage from "./pages/Main";

function App() {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/lk" element={<div>LK</div>} />
      </Routes>
  );
}

export default App;
