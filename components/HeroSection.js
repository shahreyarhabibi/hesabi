import backgroundImage from "@/public/background3.jpg";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="hidden relative md:flex min-h-screen overflow-hidden rounded-tr-[5vw]">
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Blue overlay */}
      <div className="absolute inset-0 bg-primary/80" />

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4">
        <h2 className="text-5xl font-semibold text-background font-sans">
          Let's Make Everyday <br /> Meaningful Together
        </h2>
        <p className="text-background font-sans">
          Building Meaningful Experiences together
        </p>
      </div>
    </section>
  );
}
