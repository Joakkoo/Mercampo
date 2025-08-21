import { useState, useEffect } from "react";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "../components/StepIndicator";
import { getCategories } from "../services/categoriesService";
import { createProduct } from "../services/productService";

const API_URL = import.meta.env.VITE_APP_API_URL;

export default function Publish() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [extraData, setExtraData] = useState({});

  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    title: "",
    price: "",
    quantity: "",
    description: "",
    images: [""],
    finalidad: "",
    condicion: "",
    marca: "",
    modelo: "",
    anio: "",
    moneda: "",
    localidad: "",
  });

  const subcategoriasTecnicas = [5]; // IDs de subcategorías técnicas

  const camposTecnicosPorSubcategoria = {
    "5": [
      { name: "cultivo", label: "Cultivo/Uso", type: "text" },
      { name: "distancia_surcos", label: "Distancia entre surcos (cm)", type: "number" },
      { name: "ancho_trabajo", label: "Ancho de trabajo (m)", type: "number" },
      { name: "cantidad_tolvas", label: "Cantidad de tolvas", type: "number" },
      { name: "caracteristicas_chasis", label: "Características del chasis", type: "text" },
      { name: "sistema_labranza", label: "Sistema de labranza", type: "text" },
      { name: "sistema_siembra", label: "Sistema de siembra", type: "text" },
      { name: "cantidad_surcos", label: "Cantidad de surcos", type: "number" },
    ],
  };

  // Construye los pasos dinámicamente
  const steps = [
    "Seleccionar categoría",
    "Datos básicos",
    ...(subcategoriasTecnicas.includes(Number(formData?.subcategoryId)) ? ["Datos técnicos"] : []),
    "Detalles",
    "Imágenes",
  ];

  // Control de pasos
  const [step, setStep] = useState(1);

  // Estado auxiliar
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      // console.log("Categorías cargadas:", data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Si cambia la categoría, actualiza subcategorías y limpia subcategoryId
    if (name === "categoryId") {
      const selectedCat = categories.find(cat => cat.id === Number(value));
      setSubcategories(selectedCat?.children || []);
      setFormData(prev => ({ ...prev, subcategoryId: "" }));
    }
  };

  // Manejo de datos extra
  const handleExtraDataChange = (e) => {
    const { name, value } = e.target;
    setExtraData(prev => ({ ...prev, [name]: value }));
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
      // Incluye extraData solo si corresponde
      const dataToSend = {
        ...formData,
        extraData: Object.keys(extraData).length > 0 ? extraData : undefined,
      };
      const data = await createProduct(dataToSend, token);
      setMessage("✅ Producto publicado correctamente");
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al publicar producto");
    } finally {
      setLoading(false);
    }
  };

  // Calcula el índice de contenido según los pasos dinámicos
  function getStepContentIndex() {
    // Si hay datos técnicos, los pasos coinciden con el número
    if (subcategoriasTecnicas.includes(Number(formData.subcategoryId))) {
      return step;
    }
    // Si NO hay datos técnicos, saltea ese paso
    if (step < 3) return step;
    if (step === 3) return 4; // Detalles
    if (step === 4) return 5; // Imágenes
    return step;
  }

  const stepContentIndex = getStepContentIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <Header />
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-5">
          <h1 className="text-4xl text-green-900 font-light mb-6 text-center py-4 drop-shadow-lg">Publicar Producto</h1>

          <StepIndicator step={step} subcategoryId={formData.subcategoryId} />

          {message && <p className="text-center mb-4">{message}</p>}

          {/* Contenido dinámico según el paso */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {stepContentIndex === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-light">1. Selecciona categoría</h3>
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

                  {/* Mostrar subcategorías si existen */}
                  {subcategories.length > 0 && (
                    <select
                      name="subcategoryId"
                      value={formData.subcategoryId}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">-- Selecciona una subcategoría --</option>
                      {subcategories.map((subcat) => (
                        <option key={subcat.id} value={subcat.id}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </motion.div>
              )}

              {stepContentIndex === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-light mb-2">2. Datos básicos</h3>
                  <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Precio"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Cantidad"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <select
                    name="finalidad"
                    value={formData.finalidad}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  >
                    <option value="">Finalidad</option>
                    <option value="Venta">Venta</option>
                    <option value="Compra">Compra</option>
                    <option value="Alquilo">Alquilo</option>
                  </select>
                  <select
                    name="condicion"
                    value={formData.condicion}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  >
                    <option value="">Condición</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Usado">Usado</option>
                  </select>
                  <input
                    type="text"
                    name="marca"
                    placeholder="Marca"
                    value={formData.marca}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <input
                    type="text"
                    name="modelo"
                    placeholder="Modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <input
                    type="number"
                    name="anio"
                    placeholder="Año de fabricación"
                    value={formData.anio}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <select
                    name="moneda"
                    value={formData.moneda}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  >
                    <option value="">Moneda</option>
                    <option value="ARS">Pesos</option>
                    <option value="USD">Dólares</option>
                  </select>
                  <input
                    type="text"
                    name="localidad"
                    placeholder="Localidad"
                    value={formData.localidad}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md mb-2"
                  />
                </motion.div>
              )}

              {stepContentIndex === 3 && camposTecnicosPorSubcategoria[Number(formData.subcategoryId)] && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-light">3. Datos técnicos</h3>
                  {camposTecnicosPorSubcategoria[formData.subcategoryId].map(campo => (
                    <input
                      key={campo.name}
                      type={campo.type}
                      name={campo.name}
                      placeholder={campo.label}
                      value={extraData[campo.name] || ""}
                      onChange={handleExtraDataChange}
                      className="w-full p-2 border rounded-md mb-2"
                    />
                  ))}
                </motion.div>
              )}

              {stepContentIndex === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-light">4. Detalles</h3>
                  <textarea
                    name="description"
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </motion.div>
              )}

              {stepContentIndex === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-light">5. Imágenes</h3>
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
                </motion.div>
              )}

            </AnimatePresence>

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
              {step < steps.length && (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary hover:shadow-lg"
                >
                  Siguiente
                </button>
              )}
              {step === steps.length && (
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