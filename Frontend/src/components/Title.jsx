// src/components/Title.jsx
const Title = ({ children, className = "" }) => {
    return (
      // <h1 className={`text-6xl font-bold text-green-900 drop-shadow-lg mb-2 text-center tracking-wide ${className}`}>
      <h1 className="text-6xl font-bold mb-2 text-center drop-shadow-lg text-white">
        Rural<span className="text-yellow-500">ket</span>
      </h1>
    );
  };
  
  export default Title;