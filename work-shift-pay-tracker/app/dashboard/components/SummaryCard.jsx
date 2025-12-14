export default function SummaryCard({ title, value }) {
  return (
    <div className="border rounded p-4 bg-green-50">
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}