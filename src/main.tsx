import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { armAudioUnlock } from "./engine/sharedAudioContext";

armAudioUnlock();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
