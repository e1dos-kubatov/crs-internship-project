import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import RentalProvider from "./context/RentalContext";
import "./index.css";
import "./App.css";

import { BookingProvider } from "./components/BookingContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RentalProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
      </RentalProvider>
    </AuthProvider>
  </React.StrictMode>
);
