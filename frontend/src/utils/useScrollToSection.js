// useScrollToSection.js
import { useRef } from "react";

export const useScrollToSection = () => {
  const ref = useRef(null);

  const scrollTo = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return [ref, scrollTo];
};