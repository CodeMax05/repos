import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import CreateDragon from './pages/CreateDragon';
import DragonsList from './pages/DragonsList';
import DragonDetail from './pages/DragonDetail';
import EditDragon from './pages/EditDragon';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dragons" element={<DragonsList />} />
          <Route path="/dragons/new" element={<CreateDragon />} />
          <Route path="/dragons/:id" element={<DragonDetail />} />
          <Route path="/dragons/:id/edit" element={<EditDragon />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
