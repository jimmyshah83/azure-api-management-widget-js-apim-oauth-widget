import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

import "./styles/app.scss"
import App from "./app"

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </StrictMode>
)
