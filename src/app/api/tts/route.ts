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

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildExpressiveSsmlBody(rawText: string): string {
  const normalized = normalizeBengaliForTts(rawText);
  return escapeXml(normalized);
}

function synthesizeIndianBengaliMp3(text: string): Promise<Buffer> {
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
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error("TTS synthesis timed out"));
    }, 9000);

    ws.on("open", () => {
      const configMsg =
        `Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        `{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-96kbitrate-mono-mp3"}}}}`;
      ws.send(configMsg);

      const ssml =
        `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-IN">` +
        `<voice name="${INDIAN_BENGALI_VOICE}">` +
        `<prosody rate="-3%">${buildExpressiveSsmlBody(text)}</prosody>` +
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
        if (msg.includes("Path:turn.end")) {
          clearTimeout(timeout);
          ws.close();
          const finalMp3 = Buffer.concat(audioChunks);
          if (finalMp3.length > 0) {
            resolve(finalMp3);
          } else {
            reject(new Error("Empty audio buffer returned"));
          }
        }
      }
    });

    ws.on("error", (err: Error) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

/**
 * Stateless Indian Bengali (`bn-IN-TanishaaNeural`) TTS route (`/api/tts?q=...`).
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length > 900) {
    return NextResponse.json(
      { error: "Invalid or missing text parameter" },
      { status: 400 }
    );
  }

  try {
    const mp3Buffer = await synthesizeIndianBengaliMp3(q);

    return new NextResponse(new Uint8Array(mp3Buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(mp3Buffer.byteLength),
        "Accept-Ranges": "bytes",
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
