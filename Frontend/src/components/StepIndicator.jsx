export default function StepIndicator({ step, subcategoryId }) {
  const subcategoriasTecnicas = [5]; // Agrega aquí los IDs que correspondan

  // Construye los pasos dinámicamente
  const steps = [
    "Seleccionar categoría",
    "Datos básicos",
    ...(subcategoriasTecnicas.includes(Number(subcategoryId)) ? ["Datos técnicos"] : []),
    "Detalles",
    "Imágenes",
  ];

  return (
    <div className="flex justify-between mb-6">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = step === stepNumber;
        const isCompleted = step > stepNumber;

        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center text-center"
          >
            <div
              className={`w-16 h-10 flex items-center justify-center rounded-full border-2
              ${isCompleted ? "bg-background border-background text-white" : 
                isActive ? "border-secondary text-secondary" : 
                "border-gray-300 text-gray-400"}`}
            >
              {stepNumber}
            </div>
            <p
              className={`mt-2 text-sm p-1 ${
                isActive || isCompleted ? "text-black font-default" : "text-gray-400"
              }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}