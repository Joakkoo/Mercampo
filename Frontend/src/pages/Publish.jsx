import { useState, useEffect } from "react";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "../components/StepIndicator";
import { getCategories } from "../services/categoriesService";
import { createProduct } from "../services/productService";
import Select from "react-select";
import Notification from "../components/Notification";

const API_URL = import.meta.env.VITE_APP_API_URL;

export default function Publish() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [extraData, setExtraData] = useState({});
  const [enumOptions, setEnumOptions] = useState({
    finalidad: [],
    condicion: [],
    moneda: [],
  });
  const [notification, setNotification] = useState(null);

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
      { name: "linea", label: "Línea", type: "text" },
      { name: "potencia_hp", label: "Potencia (HP)", type: "number" },
      { name: "traccion", label: "Tracción", type: "select", options: ["Simple", "Doble"] },
      { name: "direccion", label: "Dirección", type: "select", options: ["Hidráulica", "Mecánica", "Asistida", "Electrica"] },
      { name: "tipo_motor", label: "Tipo de motor", type: "select", options: ["Eléctrico", "Diésel", "Gas", "Nafta"] },
      { name: "levante_tres_puntos", label: "Levante tres puntos", type: "select", options: ["Sí", "No"] },
      { name: "cabina", label: "Cabina", type: "select", options: ["Sí", "No"] },
      { name: "variante_traccion", label: "Variante de tracción", type: "select", options: ["Articulado", "Rígido"] },
      { name: "tipo_rodado", label: "Tipo de rodado", type: "select", options: ["Oruga", "Neumático"] },
      { name: "tipo_tractor", label: "Tipo de tractor", type: "select", options: ["Autónomo", "Forestal", "Viñatero"] }
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
      console.log("Categorías cargadas:", data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchEnums = async () => {
    try {
      const response = await fetch(`${API_URL}/products/enums`);
      const data = await response.json();
      setEnumOptions({
        finalidad: data.finalidad || data.finalidades || [],
        condicion: data.condicion || data.condiciones || [],
        moneda: data.moneda || data.monedas || [],
      });
    } catch (error) {
      console.error("Error fetching enums:", error);
    }
  };

  useEffect(() => {
    fetchEnums();
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
    const dataToSend = {
      ...formData,
      extraData: Object.keys(extraData).length > 0 ? extraData : undefined,
    };
    const data = await createProduct(dataToSend, token);
    setNotification({
      message: "✅ Producto publicado correctamente",
      type: "success",
    });
  } catch (error) {
    setNotification({
      message: "❌ Error al publicar producto",
      type: "error",
    });
    console.error(error);
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

  // Opciones para categorías principales (solo parentId === null)
  const categoryOptions = categories
    .filter(cat => cat.parentId === null)
    .map(cat => ({
      value: cat.id,
      label: cat.name,
    }));

  // Opciones para subcategorías
  const subcategoryOptions = subcategories.map(subcat => ({
    value: subcat.id,
    label: subcat.name,
  }));

  const finalidadOptions = enumOptions.finalidad.map(item => ({
    value: item,
    label: item,
  }));

  const condicionOptions = enumOptions.condicion.map(item => ({
    value: item,
    label: item,
  }));

  const monedaOptions = enumOptions.moneda.map(item => ({
    value: item,
    label: item,
  }));


  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
  <Notification
    message={notification.message}
    type={notification.type}
    onClose={() => setNotification(null)}
  />
)}
      {/* Encabezado */}
      <Header />
      <div className="flex justify-center mt-4">
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
                  <Select
                    name="categoryId"
                    options={categoryOptions}
                    value={categoryOptions.find(opt => opt.value === Number(formData.categoryId))}
                    onChange={option => {
                      setFormData(prev => ({
                        ...prev,
                        categoryId: option ? option.value : "",
                        subcategoryId: "", // Limpiar subcategoría al cambiar categoría
                      }));
                      const selectedCat = categories.find(cat => cat.id === (option ? option.value : null));
                      setSubcategories(selectedCat?.children || []);
                    }}
                    placeholder="-- Selecciona una categoría --"
                    menuPlacement="auto"
                    isClearable
                    className="mb-2"
                  />

                  {/** Subcategoría */}
                  {subcategories.length > 0 && (
                    <Select
                      name="subcategoryId"
                      options={subcategoryOptions}
                      value={subcategoryOptions.find(opt => opt.value === Number(formData.subcategoryId))}
                      onChange={option =>
                        setFormData(prev => ({
                          ...prev,
                          subcategoryId: option ? option.value : "",
                        }))
                      }
                      placeholder="-- Selecciona una subcategoría --"
                      menuPlacement="auto"
                      isClearable
                      className="mb-2"
                    />
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
                  <Select
                    name="moneda"
                    options={monedaOptions}
                    value={monedaOptions.find(opt => opt.value === formData.moneda)}
                    onChange={option =>
                      setFormData(prev => ({
                        ...prev,
                        moneda: option ? option.value : "",
                      }))
                    }
                    placeholder="Moneda"
                    menuPlacement="auto"
                    isClearable
                    className="mb-2"
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
                  <Select
                    name="finalidad"
                    options={finalidadOptions}
                    value={finalidadOptions.find(opt => opt.value === formData.finalidad)}
                    onChange={option =>
                      setFormData(prev => ({
                        ...prev,
                        finalidad: option ? option.value : "",
                      }))
                    }
                    placeholder="Finalidad"
                    menuPlacement="auto"
                    isClearable
                    className="mb-2"
                  />
                  <Select
                    name="condicion"
                    options={condicionOptions}
                    value={condicionOptions.find(opt => opt.value === formData.condicion)}
                    onChange={option =>
                      setFormData(prev => ({
                        ...prev,
                        condicion: option ? option.value : "",
                      }))
                    }
                    placeholder="Condición"
                    menuPlacement="auto"
                    isClearable
                    className="mb-2"
                  />
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
                  {camposTecnicosPorSubcategoria[formData.subcategoryId].map(campo => {
                    if (campo.type === "select") {
                      const selectOptions = campo.options.map(opt => ({ value: opt, label: opt }));
                      return (
                        <Select
                          key={campo.name}
                          name={campo.name}
                          options={selectOptions}
                          value={selectOptions.find(opt => opt.value === extraData[campo.name])}
                          onChange={option =>
                            setExtraData(prev => ({
                              ...prev,
                              [campo.name]: option ? option.value : "",
                            }))
                          }
                          placeholder={campo.label}
                          menuPlacement="auto"
                          isClearable
                          className="mb-2"
                        />
                      );
                    }
                    // Default: input
                    return (
                      <input
                        key={campo.name}
                        type={campo.type}
                        name={campo.name}
                        placeholder={campo.label}
                        value={extraData[campo.name] || ""}
                        onChange={handleExtraDataChange}
                        className="w-full p-2 border rounded-md mb-2"
                      />
                    );
                  })}
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