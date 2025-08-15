import { useNavigate } from "react-router-dom"
import RegisterForm from "../components/RegisterForm";
import { registerUser } from "../services/authservice";
import useNotification from "../hooks/useNotification";
import NotificationContainer from "../components/NotificationContainer";

export default function Register() {
    const navigate = useNavigate();
    const { showSuccess, showError, notifications, removeNotification } = useNotification();

    const handleRegister = async (formData) => {
        try {
            const response = await registerUser(formData);
            console.log("Usuario registrado:", response);
            showSuccess("¡Registro exitoso! 🎉 Bienvenido a Mercampo");
            setTimeout(() => {
                navigate("/login");
            }, 1500)
        } catch (error) {
            console.error("Error en el registro:", error);
            showError("Ocurrió un error al registrarse. Por favor, intenta nuevamente.");
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
                <RegisterForm
                    title="Completa con tus datos para crear tu cuenta"
                    onSubmit={handleRegister}
                    buttonText="Registrarse"
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
