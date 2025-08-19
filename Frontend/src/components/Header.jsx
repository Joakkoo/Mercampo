import { useState } from "react";
import { Search, MapPin, User } from "lucide-react";
import Logo from "../assets/logo.png"; // cambia según tu archivo
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", search);
  };

  return (
    <header className="w-full bg-[#4a6455] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Mercampo" className="h-12 drop-shadow-lg" onClick={() => navigate("/")} />
          <h1 className="text-2xl font-bold drop-shadow-lg" onClick={() => navigate("/")}>
            Mer<span className="text-yellow-500">campo</span>
          </h1>
        </div>

        {/* Ubicación + buscador */}
        <div className="flex-1 mx-12 flex items-center">
          <span className="mr-4 text-sm text-gray-300 flex items-center gap-1">
            <MapPin size={18} /> <span className="font-medium">Enviar a</span> Villa María
          </span>

          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-xl bg-gray-200 rounded overflow-hidden"
          >
            <input
              type="text"
              placeholder="Buscar productos, marcas y más..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gray-300 px-3 flex items-center justify-center"
            >
              <Search size={18} className="text-black" />
            </button>
          </form>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-4 text-sm">
          <Link to="/publish" className="hover:underline drop-shadow-lg">
            + Publicar
          </Link>
          <Link to="/login" className="flex items-center gap-1 hover:underline drop-shadow-lg">
            <User size={16} /> Ingresar
          </Link>
        </div>
      </div>

      {/* Menú inferior */}
      <nav className="bg-[#3e5447] text-gray-200 text-sm">
        <ul className="flex gap-6 px-6 py-2 max-w-7xl mx-auto">
          <li className="cursor-pointer hover:text-white">▼ Categorías</li>
          <li className="cursor-pointer hover:text-white">Ofertas</li>
          <li className="cursor-pointer hover:text-white">Más consultados</li>
          <li className="cursor-pointer hover:text-white">Más vistos</li>
          <li className="cursor-pointer hover:text-white">Últimos publicados</li>
          <li className="cursor-pointer hover:text-white">Insumos agrícolas</li>
        </ul>
      </nav>
    </header>
  );
}
