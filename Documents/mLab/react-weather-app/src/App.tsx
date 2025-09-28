// src/App.tsx
import { MetricsProvider } from "./Hooks/useMetrics";
import { Header } from "./Components/Header";

function App() {
  return (
    <MetricsProvider>
      <Header />
      {/* other components */}
    </MetricsProvider>
  );
}

export default App;
