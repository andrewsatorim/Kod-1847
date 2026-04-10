"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Halls from "@/components/Halls";
import ReservationModal from "@/components/ReservationModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header />
      <Hero onReserve={() => setModalOpen(true)} />
      <Philosophy />
      <Halls />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
