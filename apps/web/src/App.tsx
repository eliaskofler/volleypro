import { Routes, Route } from 'react-router-dom';
import Waitlist from './pages/Waitlist';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
