import { getTexts } from "@/lib/queries";
import HookahRoomClient from "./HookahRoomClient";

export default async function HookahRoomPage() {
  const texts = await getTexts(
    "hookah_room_hero", "hookah_room_body_1", "hookah_room_body_2", "hookah_room_body_3",
    "hookah_room_session_items", "hookah_room_faq"
  );
  return <HookahRoomClient texts={texts} />;
}
