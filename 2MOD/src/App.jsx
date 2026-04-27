import { BrowserRouter as Router, Route, Routes } from 'react-router'
import Home from './pages/Home'
import ModPage from './pages/ModPage'
import ModForm from './pages/ModForm'
import PartMods from './pages/PartMods'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import './App.css'
import Navigation from './components/Navigation'

function App() {
  return (
   <div>
    <Router>
      <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mod" element={<ModPage />} />
            <Route path="/mod/add" element={<ModForm />} />
            <Route path="/mod/part/:part" element={<PartMods />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </main>
    </Router>
   </div>
  )
}

export default App
