import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/auth/AuthContext";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
};

export default App;
