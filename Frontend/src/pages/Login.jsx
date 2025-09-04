import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import useNotification from "../hooks/useNotification";
import NotificationContainer from "../components/NotificationContainer";

import { loginUser } from "../services/authService";



export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError, notifications, removeNotification } = useNotification();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (formData) => {
    try {
      const response = await loginUser(formData);
      console.log("Usuario logeado con exito", response);
      showSuccess("¡Inicio de sesión exitoso! 🎉 Bienvenido a Mercampo");

      if (response.token) {
        sessionStorage.setItem("token", response.token);
      }


      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      showError("Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat m-0 p-0"
      style={{
        backgroundImage: 'url(/src/assets/El-Agro-en-la-Argentina-cover-edit-opt.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Overlay con degradado lineal vertical: imagen arriba, blanco abajo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white"></div>

      {/* Formulario */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <LoginForm
          title="Completa con tus datos para iniciar sesión"
          onSubmit={handleLogin}
          buttonText="Iniciar Sesión"
        />
      </div>

      {/* Contenedor de notificaciones */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}