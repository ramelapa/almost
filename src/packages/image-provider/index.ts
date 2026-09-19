import { ImageProvider } from "./types";
import { MockImageProvider } from "./mock-provider";

export * from "./types";
export * from "./mock-provider";

export function getImageProvider(): ImageProvider {
  // Can be extended with remote API (e.g. FLUX/DALL-E) if IMAGE_PROVIDER=remote-api and IMAGE_API_KEY is present
  return new MockImageProvider();
}
