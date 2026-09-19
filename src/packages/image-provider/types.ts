export interface ImageAsset {
  url: string;
  alt: string;
  caption?: string;
  source: "mock" | "remote-api" | "generated-svg";
  aspectRatio?: string;
}

export interface ImageProvider {
  name: string;
  generate(prompt: string, category?: string): Promise<ImageAsset>;
}
