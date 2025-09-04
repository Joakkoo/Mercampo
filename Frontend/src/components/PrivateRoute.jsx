import { Navigate, useLocation } from "react-router-dom";

function isJwtExpired(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    if (!payload || !payload.exp) return false;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSeconds;
  } catch (_e) {
    // Si no se puede decodificar, tratamos como inválido/expirado
    return true;
  }
}

export default function PrivateRoute({ children }) {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  const location = useLocation();

  if (!token || isJwtExpired(token)) {
    // limpiar token si expiró
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    // si no hay token → login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // si hay token → muestra el componente
  return children;
}