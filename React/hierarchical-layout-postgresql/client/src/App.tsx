import './App.css';
import DiagramHierarchicalLayout from './components/DiagramHierarchicalLayout';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Syncfusion React Diagram - Hierarchical Tree Layout</h1>
      </header>
      <main className="app-main">
        <DiagramHierarchicalLayout />
      </main>
    </div>
  );
}

export default App;
