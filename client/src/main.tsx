import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.env.PROD) {
  serviceWorkerRegistration.register();
}
