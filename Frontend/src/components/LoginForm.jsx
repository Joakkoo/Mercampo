import { useState } from "react";
import SubmitButton from "./SubmitButton";
import Title from "./Title";
import Logo from "../assets/Logo.png"
import useNotification from "../hooks/useNotification";
import { Link } from "react-router-dom";

export default function RegisterForm({ title, onSubmit, buttonText }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showError, showSuccess } = useNotification();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      className="flex flex-col gap-5 max-w-md w-full p-10 bg-background rounded-lg shadow-xl"
      onSubmit={handleSubmit}
    >
      {/* Logo */}
      <div className="flex justify-center">
        <img src={Logo} alt="Mercampo Logo" className="w-20 h-20 object-contain drop-shadow-lg" />
      </div>

      {/* Título */}
      <Title>Mercampo</Title>
      <h2 className="text-center text-white text-md">{title}</h2>

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

      <SubmitButton type="submit">
        {buttonText}
      </SubmitButton>

      <p className="text-gray-300 text-sm text-center">
        ¿No tienes una cuenta?{" "}
        <Link to="/register" className="text-secondary hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}