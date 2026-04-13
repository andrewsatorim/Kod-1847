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

function scrollToTarget() {
  const targetId = sessionStorage.getItem("scrollTo");
  if (!targetId) return;
  sessionStorage.removeItem("scrollTo");

  const doScroll = (id: string, attempts: number) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: "start" });
      return;
    }
    if (attempts > 0) {
      requestAnimationFrame(() => doScroll(id, attempts - 1));
    }
  };
  requestAnimationFrame(() => doScroll(targetId, 60));
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    scrollToTarget();
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
