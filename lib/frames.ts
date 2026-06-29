import manifest from "../public/frames/manifest.json";

export type FrameManifest = {
  frameCount: number;
  scrollHeightVh: number;
  /** Leading frames that make up the Pokéball intro before the world begins. */
  introFrames: number;
  desktopBytes: number;
  mobileBytes: number;
  framePattern: string;
  firstIndex: number;
};

export const FRAME_MANIFEST = manifest as FrameManifest;
