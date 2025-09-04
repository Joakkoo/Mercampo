import { useState, useEffect } from "react";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "../components/StepIndicator";
import { getCategories } from "../services/categoriesService";
import { getCrops } from "../services/cropsService";
import { createProduct } from "../services/productService";
import Select from "react-select";
import Notification from "../components/Notification";
import { useNavigate } from "react-router-dom";
import AIAssistant from "../components/AIAssistant";

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
  const navigate = useNavigate();
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

  const subcategoriasTecnicas = [5, 6, 7]; // IDs de subcategorías técnicas

  const [cropsOptions, setCropsOptions] = useState([]);

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
    "6": [
      { name: "potencia_hp", label: "Potencia (HP)", type: "number" },
      { name: "cultivo_uso", label: "Cultivo/Uso", type: "select", options: [cropsOptions] },
      { name: "tipo_plataforma", label: "Tipo de plataforma incluida", type: "select", options: ["No incluida", "Algodonera", "Manicera", "Sojera", "Maicera", "Girasolera", "Flexible"] },
      { name: "sistema_cosecha", label: "Sistema de cosecha", type: "select", options: ["Axial", "Convencional", "Mixto"] },
      { name: "ancho_labor", label: "Ancho de labor", type: "number" },
      { name: "capacidad_tolva", label: "Capacidad de la tolva (L)", type: "number" },
    ],
    "7": [
      { name: "cultivo_uso", label: "Cultivo/Uso", type: "select", options: [cropsOptions] },
      { name: "ancho_trabajo", label: "Ancho de trabajo (m)", type: "number" },
      { name: "cantidad_tolvas", label: "Cantidad de tolvas", type: "number" },
      { name: "cantidad_surcos", label: "Cantidad de surcos", type: "number" },
      { name: "distancia_surcos", label: "Distancia entre surcos (cm)", type: "number" },
      { name: "sistema_labranza", label: "Sistema de labranza", type: "select", options: ["Convencional", "Directa"] },
      { name: "sistema_siembra", label: "Sistema de siembra", type: "select", options: ["Chorrillo", "Voleo", "Mecánica", "Neumática"] },
    ]
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
  
  // Estado del asistente de IA
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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

  // Cargar cultivos desde backend
  useEffect(() => {
    (async () => {
      try {
        const crops = await getCrops();
        setCropsOptions(
          crops.map(c => ({ value: c.slug, label: `${c.name} ${c.group ? `(${c.group})` : ''}`.trim() }))
        );
      } catch (e) {
        console.error('Error cargando cultivos', e);
      }
    })();
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
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const dataToSend = {
      ...formData,
      extraData: Object.keys(extraData).length > 0 ? extraData : undefined,
    };
    const data = await createProduct(dataToSend, token);
    setNotification({
      message: "✅ Producto publicado correctamente",
      type: "success",
    });
    setTimeout(() => {
      navigate(`/product/${data.id}`);
    }, 3000);
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

// Función para manejar el resultado del asistente de IA
const handleAIAnalysisComplete = (analysisResult) => {
  // Actualizar el formulario con la información del asistente
  setFormData(prev => ({
    ...prev,
    title: analysisResult.titulo_sugerido || prev.title,
    description: analysisResult.descripcion_sugerida || prev.description,
    marca: analysisResult.marca || prev.marca,
    modelo: analysisResult.modelo || prev.modelo,
    anio: analysisResult.anio_estimado || prev.anio,
  }));

  // Si hay datos técnicos, actualizarlos
  if (analysisResult.datos_tecnicos && Object.keys(analysisResult.datos_tecnicos).length > 0) {
    setExtraData(analysisResult.datos_tecnicos);
  }
  console.log(analysisResult.datos_tecnicos);

  // Cerrar el asistente
  setShowAIAssistant(false);

  // Mostrar notificación de éxito
  setNotification({
    message: "✨ Información del producto completada automáticamente",
    type: "success",
  });
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

                  {/* Botón del Asistente de IA */}
                  {formData.subcategoryId && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-medium text-blue-900">
                            Asistente Inteligente
                          </h4>
                        </div>
                        <p className="text-sm text-blue-700 mb-4">
                          ¿Tienes una foto de tu producto? Nuestro asistente puede ayudarte a completar automáticamente la información
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAIAssistant(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Usar Asistente de IA
                        </button>
                      </div>
                    </div>
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
                      const selectOptions = campo.name === 'cultivo_uso'
                        ? cropsOptions
                        : campo.options.map(opt => ({ value: opt, label: opt }));
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

      {/* Modal del Asistente de IA */}
      <AnimatePresence>
        {showAIAssistant && (
          <AIAssistant
            onAnalysisComplete={handleAIAnalysisComplete}
            onClose={() => setShowAIAssistant(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}