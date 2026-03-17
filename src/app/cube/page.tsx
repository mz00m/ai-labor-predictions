import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cube",
  description:
    "An isometric blueprint rendering of a mechanical cube assembly.",
  alternates: {
    canonical: "/cube",
  },
  openGraph: {
    title: "Cube — Blueprint Art",
    description:
      "An isometric blueprint rendering of a mechanical cube assembly.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cube — Blueprint Art",
    description:
      "An isometric blueprint rendering of a mechanical cube assembly.",
  },
};

export default function CubePage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f8fbff] cursor-default select-none">
      <img
        src="/images/blueprints/cube.svg"
        alt="Isometric blueprint rendering of a mechanical cube assembly with cross-hatching, dimension annotations, gears, pipes, and exploded component views"
        className="max-w-full max-h-full w-auto h-auto p-4 sm:p-8"
        draggable={false}
      />
    </div>
  );
}
