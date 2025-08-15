// src/components/Title.jsx
const Title = ({ children, className = "" }) => {
    return (
      <h1 className={`text-6xl font-bold text-green-900 drop-shadow-lg mb-2 text-center tracking-wide ${className}`}>
        {children}
      </h1>
    );
  };
  
  export default Title;