"use client";
import { useState } from "react";
import Hero from "@/components/Hero";
import ReservationModal from "@/components/ReservationModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Hero onReserve={() => setModalOpen(true)} />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
