import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <Header />

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-4">
          Bienvenido a <span className="text-yellow-600">Mercampo</span>
        </h2>
        <p className="text-gray-600">
          Encontrá productos, insumos y servicios del sector agropecuario.
        </p>

        {/* Lugar para productos, banners, etc */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">Producto 1</div>
          <div className="bg-white p-6 rounded-lg shadow">Producto 2</div>
          <div className="bg-white p-6 rounded-lg shadow">Producto 3</div>
        </div>
      </main>
    </div>
  );
}
