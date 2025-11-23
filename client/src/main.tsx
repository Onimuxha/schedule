import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for offline support
// In development: swapped out for manual testing via production build
// In production: automatically caches app for offline use
if (import.meta.env.PROD) {
  serviceWorkerRegistration.register();
}
