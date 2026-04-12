"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import RoomPreviews from "@/components/RoomPreviews";
import MenuPreview from "@/components/MenuPreview";
import EventsPreview from "@/components/EventsPreview";
import PartnershipPreview from "@/components/PartnershipPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";
import type { Event, Contact as ContactType, TextBlock } from "@/lib/types";

interface Props {
  events: Event[];
  contacts: Record<string, ContactType>;
  texts: Record<string, TextBlock>;
}

export default function HomeClient({ events, contacts, texts }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header />
      <Hero onReserve={() => setModalOpen(true)} />
      <Philosophy
        textRu={texts.philosophy?.value_ru}
        textEn={texts.philosophy?.value_en}
      />
      <RoomPreviews />
      <MenuPreview onReserve={() => setModalOpen(true)} />
      <EventsPreview events={events} />
      <PartnershipPreview />
      <Contact contacts={contacts} />
      <Footer contacts={contacts} />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
