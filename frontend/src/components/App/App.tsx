import { Leaderboard } from '../Leaderboard/Leaderboard';
import { Sidebar } from '../Sidebar/Sidebar';
import { TopNav } from '../TopNav/TopNav';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <TopNav />
        <div className="main-content">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

export default App;
