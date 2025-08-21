import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { getProductById } from "../services/productService";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

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

  if (!product) return <div className="text-center py-20">Cargando producto...</div>;

  return (
        <div className="min-h-screen bg-gray-50">
              {/* Encabezado */}
              <Header />
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Galería de imágenes */}
      <div className="lg:col-span-2">
        <div className="flex gap-4">
          {/* Miniaturas */}
          <div className="flex flex-col gap-2">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:opacity-75"
              />
            ))}
          </div>

          {/* Imagen principal */}
          <div className="flex-1">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/600"}
              alt={product.title}
              className="w-full rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <span className="text-gray-500 text-sm">{product.condition}</span>
        <h1 className="text-2xl font-bold mt-2">{product.title}</h1>
        <p className="text-3xl font-semibold text-green-700 mt-4">
          U$ {product.price}
        </p>

        <div className="mt-4">
          <a
            href="#"
            className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2"
          >
            Consultar
          </a>
          <a
            href={`https://wa.me/5493510000000?text=Hola! Me interesa ${product.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            WhatsApp
          </a>
        </div>

        {/* Info vendedor */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Información del vendedor</h3>
          <div className="flex items-center gap-3">
            <img
              src={product.seller?.avatar || "https://via.placeholder.com/50"}
              alt="vendedor"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{product.seller?.name || "Vendedor"}</p>
              <p className="text-sm text-gray-500">+50 ventas · Brinda buena atención</p>
            </div>
          </div>
          <a href="#" className="text-sm text-blue-600 mt-2 inline-block">
            Ver más productos del vendedor
          </a>
        </div>
      </div>

      {/* Detalles técnicos */}
      <div className="lg:col-span-3 mt-8">
        <h2 className="text-xl font-bold mb-4">Detalles técnicos</h2>
        <table className="w-full border border-gray-200 text-sm">
          <tbody>
            <tr className="border-b">
              <td className="p-2 font-medium bg-gray-100 w-1/4">País</td>
              <td className="p-2">{product.country}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-medium bg-gray-100">Marca</td>
              <td className="p-2">{product.brand}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-medium bg-gray-100">Modelo</td>
              <td className="p-2">{product.model}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-medium bg-gray-100">Cultivo / Uso</td>
              <td className="p-2">{product.use}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-medium bg-gray-100">Ancho de trabajo</td>
              <td className="p-2">{product.workWidth} mts</td>
            </tr>
            <tr>
              <td className="p-2 font-medium bg-gray-100">Condición</td>
              <td className="p-2">{product.condition}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
