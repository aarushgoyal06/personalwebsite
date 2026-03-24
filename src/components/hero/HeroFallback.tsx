"use client";

export default function HeroFallback() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Decorative gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a] to-[#0a0a0a]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white/[0.03] blur-3xl" />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <div className="text-6xl mb-6">🧱</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Hey, I&apos;m Aarush.
        </h1>
        <p className="text-lg text-neutral-400 leading-relaxed mb-8">
          Developer, builder, and creative coder. I bring ambitious ideas to
          life — one brick at a time.
        </p>
        <p className="text-sm text-neutral-600">
          View on desktop for the full 3D experience.
        </p>
      </div>
    </div>
  );
}
