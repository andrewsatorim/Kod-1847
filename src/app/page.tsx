"use client";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollTo");
    if (targetId) {
      sessionStorage.removeItem("scrollTo");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      }, 100);
    }
  }, []);

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
