import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

const API_URL = import.meta.env.VITE_APP_API_URL;

export default function Publish() {

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/categories`);
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const [formData, setFormData] = useState({
        categoryId: "",
        title: "",
        price: "",
        quantity: "",
        description: "",
        images: [""],
    });

    // Control de pasos
    const [step, setStep] = useState(1);

    // Estado auxiliar
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Manejo de inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejo de imagines
    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("✅ Producto publicado correctamente");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al publicar producto");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="min-h-screen bg-gray-50">
          {/* Encabezado */}
          <Header />
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Publicar Producto</h2>

        {message && <p className="text-center mb-4">{message}</p>}

        {/* Contenido dinámico según el paso */}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Selecciona categoría</h3>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Selecciona una categoría --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">2. Datos básicos</h3>
              <input
                type="text"
                name="title"
                placeholder="Título"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Cantidad"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">3. Detalles</h3>
              <textarea
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">4. Imágenes</h3>
              {formData.images.map((img, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder={`URL de la imagen ${idx + 1}`}
                  className="w-full p-2 border rounded-md mb-2"
                />
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-sm text-blue-600 hover:underline"
              >
                + Agregar otra imagen
              </button>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Atrás
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Siguiente
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {loading ? "Publicando..." : "Publicar"}
              </button>
            )}
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}