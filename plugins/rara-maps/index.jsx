import { createRoot } from 'react-dom/client';
import App from './src/App.jsx';

function mount() {
  const container = document.getElementById('rara-maps-react-root');
  if (!container) return;

  const root = createRoot(container);
  root.render(<App />);
}

// Automatically mount when the page loads
document.addEventListener('DOMContentLoaded', mount);

// Optional: export mount() so WordPress / other scripts can call it manually
export { mount };
