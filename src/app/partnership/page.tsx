import { getPartnershipFormats, getClubEvents, getTexts, getContacts } from "@/lib/queries";
import PartnershipPageClient from "./PartnershipPageClient";

export default async function PartnershipPage() {
  const [formats, clubEvents, texts, contacts] = await Promise.all([
    getPartnershipFormats(),
    getClubEvents(),
    getTexts("partnership_hero", "partnership_tagline", "partnership_closing", "ambassador_percent", "ambassador_desc", "ambassador_perk"),
    getContacts(),
  ]);
  return <PartnershipPageClient formats={formats} clubEvents={clubEvents} texts={texts} contacts={contacts} />;
}
