import StatsCards from '../StatsCards'

export default function StatsCardsExample() {
  return (
    <StatsCards
      totalRecords={25}
      successfulRecords={23}
      errorRecords={2}
    />
  );
}
