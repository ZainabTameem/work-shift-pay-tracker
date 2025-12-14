import SummaryCard from "./SummaryCard";

export default function EarningsCard({ amount }) {
  return (
    <SummaryCard
      title="Estimated Earnings"
      value={"$" + amount}
    />
  );
}