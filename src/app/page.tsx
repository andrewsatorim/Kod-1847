import { getEventsPreview, getContacts, getTexts } from "@/lib/queries";
import HomeClient from "./HomeClient";

export default async function Home() {
  const [events, contacts, texts] = await Promise.all([
    getEventsPreview(3),
    getContacts(),
    getTexts("philosophy"),
  ]);
  return <HomeClient events={events} contacts={contacts} texts={texts} />;
}
