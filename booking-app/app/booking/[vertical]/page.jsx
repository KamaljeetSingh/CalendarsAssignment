import { getConfig } from "../../../lib/config";
import { getSessions } from "../../../lib/api";
import BookingWidget from "../../../components/BookingWidget";
import ServiceSelection from "../../../components/ServiceSelection";
import SessionList from "../../../components/SessionList";
import DateRangeForm from "../../../components/DateRangeForm";

export async function generateStaticParams() {
  return [{ vertical: "salon" }, { vertical: "class" }, { vertical: "rental" }];
}

export default async function BookingPage({ params }) {
  const config = await getConfig(params.vertical);

  return <BookingWidget config={config} />;
}
