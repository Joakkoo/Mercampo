const SubmitButton = ({ children, onClick, disabled = false, type = "submit" }) => {

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
            {children}
        </button>
    );
};

export default SubmitButton;