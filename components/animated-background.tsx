"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let particles: { x: number; y: number; r: number; speed: number; opacity: number; drift: number }[] = []

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const particleCount = Math.min(60, Math.floor(window.innerWidth / 25))

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.4 + 0.15,
        opacity: Math.random() * 0.4 + 0.1,
        drift: (Math.random() - 0.5) * 0.3,
      })
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(99, 220, 190, ${p.opacity})`
        ctx.fill()

        // Soft glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(99, 220, 190, ${p.opacity * 0.15})`
        ctx.fill()

        p.y += p.speed
        p.x += p.drift

        if (p.y > canvas.height + 10) {
          p.y = -10
          p.x = Math.random() * canvas.width
        }
        if (p.x > canvas.width + 10) p.x = -10
        if (p.x < -10) p.x = canvas.width + 10
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0c1a30] opacity-[0.03]" />
      {/* Subtle mesh gradient blobs */}
      <div className="absolute left-1/4 top-1/4 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 size-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-chart-3/[0.03] blur-[100px]" />
      <div className="absolute right-1/3 top-1/2 size-[350px] rounded-full bg-accent/[0.025] blur-[100px]" />
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 size-full opacity-60" />
    </div>
  )
}
