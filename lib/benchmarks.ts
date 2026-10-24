export type Row = {
  library: string;
  fps: number;
  low: number;
  high: number;
  bytes: number;
  rate: number;
  allocated: number;
};

export type Test = {
  name: string;
  sends: string;
  rows: Row[];
  unsupported: string[];
};

export type Held = { library: string; server: number; client: number };

const row = (
  library: string,
  fps: number,
  low: number,
  high: number,
  bytes: number,
  rate: number,
  allocated: number,
): Row => ({ library, fps, low, high, bytes, rate, allocated });

export const TESTS: Test[] = [
  {
    name: "Booleans",
    sends: "1,000 booleans",
    unsupported: [],
    rows: [
      row("Courier", 162, 146, 164, 127, 1929, 0),
      row("QuickNet", 160, 152, 161, 128, 1870, 66),
      row("NetRayCompile", 152, 150, 152, 127, 1896, 0),
      row("Satset", 144, 140, 152, 127, 1887, 0),
      row("BlinkBlox", 138, 132, 140, 128, 1825, 0),
      row("Blink", 124, 120, 132, 1003, 2922, 3817),
      row("Squash", 116, 116, 124, 127, 3534, 135),
      row("Lync", 108, 106, 114, 127, 1872, 119),
      row("Zap", 106, 100, 110, 1003, 2885, 2097),
      row("BitNet", 87, 84, 89, 128, 1900, 0),
      row("ByteNet", 81, 76, 92, 1003, 1558, 0),
      row("Packet", 70, 70, 71, 1003, 2966, 66),
      row("PakNet", 48, 46, 50, 131, 3974, 1475),
      row("Roblox remotes", 31, 30, 32, 9000, 58717, 0),
    ],
  },
  {
    name: "Dict",
    sends: "a map of 200 short strings to numbers",
    unsupported: ["ByteNet", "Packet"],
    rows: [
      row("Courier", 55, 54, 58, 1955, 19959, 0),
      row("QuickNet", 55, 54, 57, 2010, 21292, 3789),
      row("Blink", 53, 50, 54, 2206, 22866, 8618),
      row("NetRayCompile", 53, 47, 56, 2005, 20633, 0),
      row("BlinkBlox", 52, 52, 53, 2006, 20575, 0),
      row("Zap", 52, 51, 56, 2007, 20990, 4194),
      row("BitNet", 50, 50, 54, 2006, 20616, 0),
      row("Satset", 39, 38, 41, 2005, 19957, 4145),
      row("Squash", 35, 35, 36, 2005, 347370, 2011),
      row("PakNet", 34, 31, 38, 2009, 156118, 7373),
      row("Lync", 34, 33, 37, 2006, 21118, 2019),
      row("Roblox remotes", 29, 29, 31, 3203, 131715, 0),
    ],
  },
  {
    name: "Entities",
    sends: "100 structs of six bytes",
    unsupported: [],
    rows: [
      row("Courier", 116, 107, 120, 603, 9044, 0),
      row("BlinkBlox", 100, 96, 108, 602, 8746, 0),
      row("QuickNet", 99, 99, 104, 603, 8800, 66),
      row("BitNet", 81, 79, 85, 602, 9120, 0),
      row("Blink", 80, 79, 81, 603, 9043, 2544),
      row("NetRayCompile", 80, 76, 81, 602, 9087, 0),
      row("ByteNet", 75, 74, 79, 603, 8922, 0),
      row("Zap", 71, 70, 75, 603, 8287, 2097),
      row("Lync", 70, 65, 76, 602, 8749, 545),
      row("Satset", 60, 58, 60, 602, 8961, 0),
      row("Packet", 53, 52, 59, 603, 9383, 66),
      row("PakNet", 52, 50, 55, 606, 61708, 3432),
      row("Squash", 49, 47, 50, 601, 114951, 10207),
      row("Roblox remotes", 18, 18, 18, 8100, 510830, 0),
    ],
  },
  {
    name: "Numbers",
    sends: "1,000 numbers from 0 to 255",
    unsupported: [],
    rows: [
      row("Courier", 143, 128, 148, 1003, 14837, 0),
      row("QuickNet", 142, 139, 148, 1003, 14812, 66),
      row("Satset", 134, 132, 144, 1002, 14746, 0),
      row("Blink", 128, 128, 138, 1003, 14463, 3817),
      row("BitNet", 124, 124, 126, 1003, 15086, 0),
      row("Zap", 118, 112, 124, 1003, 14952, 2097),
      row("BlinkBlox", 116, 116, 128, 1003, 15147, 0),
      row("NetRayCompile", 114, 112, 116, 1002, 14987, 0),
      row("ByteNet", 97, 96, 100, 1003, 14922, 0),
      row("Lync", 90, 87, 92, 1002, 15120, 967),
      row("Squash", 80, 79, 83, 1002, 437691, 1012),
      row("Packet", 60, 59, 76, 1003, 15584, 66),
      row("PakNet", 60, 56, 65, 1006, 78911, 3834),
      row("Roblox remotes", 30, 29, 31, 16000, 367731, 0),
    ],
  },
  {
    name: "Strings",
    sends: "300 strings of 4 to 16 letters",
    unsupported: ["ByteNet"],
    rows: [
      row("Courier", 39, 35, 42, 3229, 27246, 0),
      row("Blink", 36, 35, 41, 3605, 30758, 12923),
      row("Zap", 35, 35, 36, 3305, 30696, 8389),
      row("NetRayCompile", 35, 34, 38, 3304, 31675, 0),
      row("QuickNet", 35, 34, 39, 3309, 33580, 10318),
      row("BlinkBlox", 34, 34, 40, 3305, 31033, 0),
      row("Packet", 33, 29, 38, 3305, 31253, 66),
      row("Lync", 32, 31, 38, 3305, 33274, 3318),
      row("Satset", 32, 31, 39, 3604, 32350, 0),
      row("BitNet", 31, 15, 64, 3305, 29144, 0),
      row("Squash", 28, 28, 29, 3304, 145677, 3310),
      row("Roblox remotes", 26, 24, 27, 5402, 871869, 0),
      row("PakNet", 25, 25, 30, 3308, 137777, 12259),
    ],
  },
  {
    name: "Vectors",
    sends: "100 Vector3s",
    unsupported: [],
    rows: [
      row("Courier", 166, 166, 178, 1203, 16091, 0),
      row("BitNet", 165, 164, 176, 1202, 16076, 0),
      row("QuickNet", 165, 157, 173, 1203, 15684, 66),
      row("Satset", 164, 160, 168, 1202, 16302, 0),
      row("Blink", 164, 153, 165, 1203, 16072, 3817),
      row("NetRayCompile", 163, 155, 168, 1202, 16381, 0),
      row("ByteNet", 160, 146, 164, 1203, 16115, 0),
      row("BlinkBlox", 160, 125, 168, 1202, 16382, 0),
      row("Zap", 153, 152, 160, 1203, 16349, 4194),
      row("Packet", 142, 140, 152, 1203, 16224, 66),
      row("Roblox remotes", 136, 128, 144, 2000, 171186, 0),
      row("Lync", 124, 110, 132, 1202, 16208, 1151),
      row("Squash", 89, 48, 96, 1201, 69156, 1208),
      row("PakNet", 74, 71, 90, 1206, 40259, 6058),
    ],
  },
];

export const HELD: Held[] = [
  { library: "Roblox remotes", server: 8, client: 8 },
  { library: "Zap", server: 611, client: 97 },
  { library: "Blink", server: 589, client: 156 },
  { library: "ByteNet", server: 230, client: 736 },
  { library: "PakNet", server: 492, client: 484 },
  { library: "BlinkBlox", server: 1476, client: 180 },
  { library: "NetRayCompile", server: 400, client: 1326 },
  { library: "Squash", server: 871, client: 869 },
  { library: "Lync", server: 2231, client: 1826 },
  { library: "Courier", server: 2538, client: 1582 },
  { library: "BitNet", server: 1566, client: 3095 },
  { library: "Packet", server: 2678, client: 2288 },
  { library: "Satset", server: 2603, client: 7657 },
  { library: "QuickNet", server: 2695, client: 9337 },
];

export const VERSIONS: { library: string; version: string }[] = [
  { library: "Blink", version: "v0.18.9" },
  { library: "BlinkBlox", version: "v1.3.1" },
  { library: "Zap", version: "v0.6.29" },
  { library: "NetRayCompile", version: "v0.1.1-cli.1" },
  { library: "Lync", version: "3dbcbd3" },
  { library: "QuickNet", version: "edba9a2" },
  { library: "Squash", version: "v5.0.0" },
  { library: "Satset", version: "v0.5.0" },
  { library: "ByteNet", version: "92addc1" },
  { library: "BitNet", version: "f16394b" },
  { library: "PakNet", version: "v0.9.0" },
  { library: "Packet", version: "a copy added by hand, not pinned" },
];
