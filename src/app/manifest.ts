import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Early Signals of AI Impact",
    short_name: "jobsdata.ai",
    description:
      "400+ sources tracking AI's impact on jobs, wages, and adoption across 17 interactive prediction graphs.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#5C61F6",
    icons: [
      {
        src: "/icon",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
