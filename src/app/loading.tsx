import Image from "next/image";

export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-ink text-white"
      role="status"
      aria-label="Loading page"
    >
      <div className="relative flex h-32 w-40 items-center justify-center">
        <span className="absolute h-28 w-28 animate-ping rounded-full border border-safety/40 [animation-duration:1.8s]" />
        <span className="absolute h-28 w-28 animate-pulse rounded-full border border-safety/70" />
        <Image
          src="/media/logo/hero-center.svg?v=4"
          alt="Sahil Industries"
          width={128}
          height={96}
          priority
          className="relative z-10 h-24 w-32 object-contain"
        />
      </div>
      <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[.2em] text-safety/90">
        Loading...
      </p>
    </div>
  );
}
