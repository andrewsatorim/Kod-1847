import { getAllMenuCategories } from "@/lib/queries";
import MenuPageClient from "./MenuPageClient";

export default async function MenuPage() {
  const allCategories = await getAllMenuCategories();
  return <MenuPageClient allCategories={allCategories} />;
}
