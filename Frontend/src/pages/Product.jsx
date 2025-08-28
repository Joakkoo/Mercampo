import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getProductById } from "../services/productService";
import { MessageCircle, Phone } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        console.log("Producto cargado:", data);
      } catch (error) {
        console.error("Error cargando producto", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Galería de imágenes mejorada */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Imagen principal */}
              <div className="relative group">
                <img
                  src={product.images?.[selectedImage]?.url || product.images?.[0]?.url || "https://via.placeholder.com/800x600"}
                  alt={product.title}
                  className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Miniaturas */}
              {product.images && product.images.length > 1 && (
                <div className="p-2 bg-gray-50">
                  <div className="flex gap-3 overflow-x-auto pb-3 p-2">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === i
                          ? 'border-green-500 shadow-md scale-105'
                          : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                          }`}
                      >
                        <img
                          src={img.url}
                          alt={`${product.title} ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho mejorado */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                  {product.condicion}
                </div>

                <h1 className="text-2xl lg:text-2xl font-bold text-gray-900 leading-tight font-montserrat">
                  {product.title}
                </h1>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent font-montserrat">
                    {product.moneda} {product.price}
                  </span>
                </div>

                <div className="space-y-3 pt-4">
                  <button className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-200 hover:from-green-700 hover:to-green-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                    <MessageCircle size={18} className="inline-block" /> Consultar
                  </button>

                  <a
                    href={`https://wa.me/5493510000000?text=Hola! Me interesa ${product.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-green-500 to-green-400 text-white py-2 px-6 rounded-xl font-semibold text-center transition-all duration-200 hover:from-green-600 hover:to-green-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Phone size={18} className="inline-block" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Info vendedor mejorada */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4 font-montserrat">Información del vendedor</h3>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={product.seller?.avatar || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"}
                    alt="vendedor"
                    className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-lg">{product.seller?.name || "Vendedor"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-yellow-400">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i} className="text-sm">{star}</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">+50 ventas</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">✓ Brinda buena atención</p>
                </div>
              </div>
              <button className="w-full mt-4 text-green-600 hover:text-green-700 font-medium text-sm py-2 px-4 rounded-lg border border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                Ver más productos del vendedor →
              </button>
            </div>
          </div>
        </div>

        {/* Detalles técnicos - Tabla simple */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Detalles técnicos</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: "Localidad", value: product.localidad },
                    { label: "Marca", value: product.marca },
                    { label: "Modelo", value: product.modelo },
                    { label: "Condición", value: product.condicion },
                    { label: "Año de fabricación", value: product.anio },
                    { label: "Línea", value: product.extraData?.linea },
                    { label: "Potencia (HP)", value: product.extraData?.potencia_hp },
                    { label: "Tracción", value: product.extraData?.traccion },
                    { label: "Dirección", value: product.extraData?.direccion },
                    { label: "Tipo de motor", value: product.extraData?.tipo_motor },
                    { label: "Levante tres puntos", value: product.extraData?.levante_tres_puntos },
                    { label: "Cabina", value: product.extraData?.cabina },
                    { label: "Variante de tracción", value: product.extraData?.variante_traccion },
                    { label: "Tipo de rodado", value: product.extraData?.tipo_rodado },
                    { label: "Tipo de tractor", value: product.extraData?.tipo_tractor },
                  ].filter(item => item.value).map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50 w-1/3">{item.label}</td>
                      <td className="px-4 py-2 text-gray-900">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Descripción compacta */}
          {product.description && (
            <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Descripción</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}