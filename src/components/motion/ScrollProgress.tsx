import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Gold scroll-progress rule pinned to the top of the viewport.
 *
 * Driven by Motion's `useScroll` so the value is interpolated off the main
 * thread. Under reduced motion the scale still tracks scroll — it is a progress
 * indicator, not decoration — but the spring is replaced with a direct
 * assignment so nothing eases.
 */
export function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      data-testid="scroll-progress"
      className="pointer-events-none fixed inset-x-0 top-0 z-100 h-[3px] origin-left bg-gold-bright"
      style={{ scaleX: prefersReducedMotion ? scrollYProgress : scaleX }}
    />
  );
}
