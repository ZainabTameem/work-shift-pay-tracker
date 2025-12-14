export default function Button({ children, ...props }) {
  return (
    <button
      type="submit"
      className="w-full bg-teal-900 text-white py-2 rounded-full hover:bg-teal-800 transition disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}