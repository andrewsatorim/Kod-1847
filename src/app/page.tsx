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

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header />
      <Hero onReserve={() => setModalOpen(true)} />
      <Philosophy />
      <RoomPreviews />
      <MenuPreview onReserve={() => setModalOpen(true)} />
      <EventsPreview />
      <PartnershipPreview />
      <Contact />
      <Footer />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
