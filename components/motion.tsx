"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeInUp({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={scaleIn} className={className}>
      {children}
    </motion.div>
  )
}

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={
        hover
          ? {
              y: -6,
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }
          : undefined
      }
      className={`rounded-2xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/[0.04] backdrop-blur-xl ${className ?? ""}`}
    >
      {children}
    </motion.div>
  )
}

export { pageVariants, staggerContainer, fadeInUp, scaleIn }
