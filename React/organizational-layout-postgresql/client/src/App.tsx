import './App.css';
import OrganizationalLayout from './components/OrganizationalLayout';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Syncfusion React Diagram - Organizational chart Layout</h1>
      </header>
      <main className="app-main">
        <OrganizationalLayout />
      </main>
    </div>
  );
}

export default App;
