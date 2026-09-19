import { ImageAsset, ImageProvider } from "./types";

const curatedImages: Record<string, string[]> = {
  car: [
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop", // McLaren / Hypercar
    "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop", // Aston Martin / Luxury
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop", // Porsche
  ],
  watch: [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop", // Tourbillon luxury watch
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop", // Mechanical watch close up
  ],
  travel: [
    "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop", // Swiss alpine peaks & lake
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop", // Dramatic mountains
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop", // Kyoto Japanese temple
  ],
  escape: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop", // Cozy rain cafe / coffee
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop", // Japanese rain garden
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop", // Snowy cabin night stars
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop", // Quiet tropical beach
  ],
  billion: [
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?q=80&w=1200&auto=format&fit=crop", // Mega Yacht ocean
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1200&auto=format&fit=crop", // Private tropical island
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop", // Futuristic skyscraper
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop", // Space Earth orbit
  ],
  gadget: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop", // Minimalist premium smartphone
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop", // Premium espresso machine
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop", // High-end telescope / astronomy
  ],
};

export class MockImageProvider implements ImageProvider {
  name = "mock";

  async generate(prompt: string, category?: string): Promise<ImageAsset> {
    const p = prompt.toLowerCase();
    let cat = category || "gadget";

    if (p.includes("car") || p.includes("drive") || p.includes("ferrari") || p.includes("lamborghini") || p.includes("porsche")) {
      cat = "car";
    } else if (p.includes("watch") || p.includes("rolex") || p.includes("timepiece")) {
      cat = "watch";
    } else if (p.includes("switzerland") || p.includes("travel") || p.includes("trip") || p.includes("flight") || p.includes("vacation")) {
      cat = "travel";
    } else if (p.includes("escape") || p.includes("peace") || p.includes("relax") || p.includes("quiet") || p.includes("kyoto") || p.includes("cafe")) {
      cat = "escape";
    } else if (p.includes("billion") || p.includes("yacht") || p.includes("island") || p.includes("skyscraper") || p.includes("moon")) {
      cat = "billion";
    }

    const pool = curatedImages[cat] || curatedImages.gadget;
    const index = Math.abs(this.hashString(prompt)) % pool.length;
    const selectedUrl = pool[index];

    return {
      url: selectedUrl,
      alt: prompt,
      caption: `Simulated visual representation of ${prompt}`,
      source: "mock",
      aspectRatio: "16:9",
    };
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
