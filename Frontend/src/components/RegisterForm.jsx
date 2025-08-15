import { useState } from "react";
import SubmitButton from "./SubmitButton";
import Title from "./Title";
import Logo from "../assets/Logo.png"
import useNotification from "../hooks/useNotification";

export default function RegisterForm({ title, onSubmit, buttonText }) {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showError, showSuccess } = useNotification();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validar contraseña en tiempo real
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    setPasswordRequirements({
      minLength: password.length >= 10,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      showError("Las contraseñas no coinciden");
      return;
    }
    
    // Verificar que se cumplan todos los requisitos
    if (!isFormValid()) {
      showError("Por favor, asegúrate de que la contraseña cumpla todos los requisitos");
      return;
    }
    
    onSubmit(formData);
  };



  const isFormValid = () => {
    return Object.values(passwordRequirements).every(req => req) && 
           formData.name.trim() && 
           formData.lastname.trim() && 
           formData.email.trim() && 
           formData.password.trim() && 
           formData.confirmPassword.trim();
  };

  return (
    <form className="flex flex-col gap-4 max-w-md w-full p-5 bg-white backdrop-blur-sm rounded-lg shadow-xl" onSubmit={handleSubmit}>
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={Logo} 
            alt="Mercampo Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>
        
        {/* Título */}
        <Title>Mercampo</Title>
        
        {/* Subtítulo */}
        <h2 className="text-center text-gray-600 text-md">{title}</h2>

      <input
        className="border border-gray-300 rounded-md p-2"
        type="text"
        name="name"
        placeholder="Nombre"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        className="border border-gray-300 rounded-md p-2"
        type="text"
        name="lastname"
        placeholder="Apellido"
        value={formData.lastname}
        onChange={handleChange}
        required
      />

      <input
        className="border border-gray-300 rounded-md p-2"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        className="border border-gray-300 rounded-md p-2"
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
          Creá una contraseña con:
        </h3>
        <ul className="space-y-2 text-xs">
          <li className={`flex items-center ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.minLength ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            10 caracteres como mínimo
          </li>
          <li className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            Al menos 1 carácter en minúscula
          </li>
          <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            Al menos 1 carácter en mayúscula
          </li>
          <li className={`flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.number ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            Al menos 1 número
          </li>
          <li className={`flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.special ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            Al menos 1 carácter especial
          </li>
        </ul>
      </div>

      <input
        className="border border-gray-300 rounded-md p-2"
        type="password"
        name="confirmPassword"
        placeholder="Confirmar contraseña"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />


      <p className="text-sm text-gray-500">
        Al registrarte, aceptas nuestros <a href="/terms" className="text-blue-500">Términos y Condiciones</a> y nuestra <a href="/privacy" className="text-blue-500">Política de Privacidad</a>.
      </p>

      <SubmitButton type="submit" disabled={isSubmitting || !isFormValid()}>
        {buttonText}
      </SubmitButton>
    </form>
  );
}
