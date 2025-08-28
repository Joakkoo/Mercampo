import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCarousel from "../components/Carousel";
import { getProducts } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        console.log("Productos traídos:", data);
      } catch (error) {
        console.error("Error al traer productos:", error);
      }
    };

    fetchData();
  }, []);

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
      {/* Overlay con degradado */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-5xl font-extrabold mb-4 font-staatliches">
            Bienvenido a Rural<span className="text-secondary">ket</span>
          </h2>
          <p className="text-gray-600 text-lg font-semibold font-montserrat">
            Encontrá productos, insumos y servicios del sector agropecuario.
          </p>

          {/* Le paso los productos al carrusel */}
          <ProductCarousel products={products} />
        </main>
      </div>
    </div>
  );
}
