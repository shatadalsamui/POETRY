import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import WebSocket from "next/dist/compiled/ws";
import {
  CHROMIUM_FULL_VERSION,
  generateSecMsGecV2,
  SEC_MS_GEC_VERSION,
  TRUSTED_CLIENT_TOKEN,
} from "@/lib/audio/edgeDrm";
import { normalizeBengaliForTts } from "@/lib/audio/bengaliPronunciation";

const INDIAN_BENGALI_VOICE = "bn-IN-TanishaaNeural";
const BYTES_PER_SEC_96KBPS = 12000;
const MP3_FRAME_BYTES = 288; // 24kHz 96kbps mono MP3 frame = 288 bytes (24ms)

interface SynthesizedAudioResult {
  mp3Buffer: Buffer;
  wordOffsets: number[];
  speechEnd: number;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function synthesizeIndianBengaliMp3(
  text: string
): Promise<SynthesizedAudioResult> {
  return new Promise((resolve, reject) => {
    const reqId = crypto.randomUUID().replace(/-/g, "");
    const muid = crypto.randomBytes(16).toString("hex").toUpperCase();
    const secMsGec = generateSecMsGecV2();
    const majorVer = CHROMIUM_FULL_VERSION.split(".")[0];

    const wsUrl =
      `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1` +
      `?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
      `&Sec-MS-GEC=${secMsGec}` +
      `&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}` +
      `&ConnectionId=${reqId}`;

    const ws = new WebSocket(wsUrl, {
      headers: {
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
        "User-Agent":
          `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ` +
          `(KHTML, like Gecko) Chrome/${majorVer}.0.0.0 Safari/537.36 Edg/${majorVer}.0.0.0`,
        Cookie: `muid=${muid};`,
      },
    });

    const audioChunks: Buffer[] = [];
    const wordOffsets: number[] = [];
    let speechEnd = 0;

    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error("TTS synthesis timed out"));
    }, 9000);

    ws.on("open", () => {
      const configMsg =
        `Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        `{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},"outputFormat":"audio-24khz-96kbitrate-mono-mp3"}}}}`;
      ws.send(configMsg);

      const normalized = escapeXml(normalizeBengaliForTts(text));
      const ssml =
        `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-IN">` +
        `<voice name="${INDIAN_BENGALI_VOICE}">` +
        `<prosody rate="-3%">${normalized}</prosody>` +
        `</voice></speak>`;

      const ssmlMsg =
        `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\n` +
        `X-Timestamp:${new Date().toISOString()}Z\r\nPath:ssml\r\n\r\n${ssml}`;
      ws.send(ssmlMsg);
    });

    ws.on("message", (data: Buffer, isBinary: boolean) => {
      if (isBinary) {
        const buf = Buffer.from(data);
        if (buf.length > 2) {
          const headerLen = buf.readUInt16BE(0);
          const audio = buf.subarray(2 + headerLen);
          if (audio.length > 0) audioChunks.push(audio);
        }
      } else {
        const msg = data.toString();
        if (msg.includes("Path:audio.metadata")) {
          try {
            const jsonPart = msg.split("\r\n\r\n")[1];
            const parsed = JSON.parse(jsonPart);
            for (const item of parsed.Metadata || []) {
              if (item.Type === "WordBoundary" && item.Data) {
                const startSec = item.Data.Offset / 1e7;
                const durSec = (item.Data.Duration || 0) / 1e7;
                wordOffsets.push(Number(startSec.toFixed(3)));
                speechEnd = Math.max(speechEnd, startSec + durSec);
              }
            }
          } catch {
            // ignore metadata parse error
          }
        } else if (msg.includes("Path:turn.end")) {
          clearTimeout(timeout);
          ws.close();
          const rawMp3 = Buffer.concat(audioChunks);
          if (rawMp3.length === 0) {
            reject(new Error("Empty audio buffer returned"));
            return;
          }

          // Trim excess trailing silence beyond speechEnd + 0.24s on exact 288-byte MP3 frame boundary
          let finalMp3 = rawMp3;
          if (speechEnd > 0.2) {
            const targetBytes =
              Math.ceil(((speechEnd + 0.24) * BYTES_PER_SEC_96KBPS) / MP3_FRAME_BYTES) *
              MP3_FRAME_BYTES;
            if (targetBytes > MP3_FRAME_BYTES && targetBytes < rawMp3.length) {
              finalMp3 = rawMp3.subarray(0, targetBytes);
            }
          }

          resolve({ mp3Buffer: finalMp3, wordOffsets, speechEnd });
        }
      }
    });

    ws.on("error", (err: Error) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length > 900) {
    return NextResponse.json(
      { error: "Invalid or missing text parameter" },
      { status: 400 }
    );
  }

  try {
    const { mp3Buffer, wordOffsets, speechEnd } =
      await synthesizeIndianBengaliMp3(q);

    return new NextResponse(new Uint8Array(mp3Buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(mp3Buffer.byteLength),
        "Accept-Ranges": "bytes",
        "X-Word-Offsets": wordOffsets.join(","),
        "X-Speech-End": speechEnd.toFixed(3),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to synthesize Indian Bengali audio" },
      { status: 502 }
    );
  }
}
