import SummaryCard from "./SummaryCard";

export default function WeeklyHoursCard({ hours }) {
  return (
    <SummaryCard
      title="Weekly Hours"
      value={hours + " hrs"}
    />
  );
}