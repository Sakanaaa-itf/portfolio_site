import RamenPage from "@/components/RamenPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
	description: "訪れたラーメン店と食べた一杯の記録です。",
	path: "/ramen/",
	title: "Ramen",
});

export default function RamenListPage() {
	return <RamenPage />;
}
