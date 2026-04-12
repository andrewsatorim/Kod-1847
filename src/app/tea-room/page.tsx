import { getTexts } from "@/lib/queries";
import TeaRoomClient from "./TeaRoomClient";

export default async function TeaRoomPage() {
  const texts = await getTexts(
    "tea_room_hero", "tea_room_body_1", "tea_room_body_2", "tea_room_body_3",
    "tea_room_session_items", "tea_room_faq"
  );
  return <TeaRoomClient texts={texts} />;
}
