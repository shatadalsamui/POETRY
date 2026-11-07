export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function wrapLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [""];
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const wrapped: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const candidate = `${current} ${words[i]}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      wrapped.push(current);
      current = words[i];
    }
  }
  wrapped.push(current);
  return wrapped;
}

export function drawCornerFlourish(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  dx: number,
  dy: number
) {
  ctx.save();
  ctx.strokeStyle = "rgba(179, 139, 77, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy + dy * 22);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + dx * 22, cy);
  ctx.stroke();

  ctx.fillStyle = "rgba(152, 43, 27, 0.65)";
  ctx.beginPath();
  ctx.arc(cx + dx * 6, cy + dy * 6, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawFountainNibIcon(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fbf9f4";
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = "rgba(179, 139, 77, 0.7)";
  ctx.stroke();

  const scale = (radius * 1.15) / 12;
  ctx.translate(centerX - 12 * scale, centerY - 12 * scale);
  ctx.scale(scale, scale);

  ctx.beginPath();
  ctx.moveTo(12, 2.5);
  ctx.lineTo(17, 11.5);
  ctx.bezierCurveTo(16.2, 15, 15, 18.5, 12, 21);
  ctx.bezierCurveTo(9, 18.5, 7.8, 15, 7, 11.5);
  ctx.closePath();
  ctx.fillStyle = "#982b1b";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(9.5, 20);
  ctx.lineTo(14.5, 20);
  ctx.lineTo(14.8, 22);
  ctx.lineTo(9.2, 22);
  ctx.closePath();
  ctx.fillStyle = "#b38b4d";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(12, 12, 1.35, 0, Math.PI * 2);
  ctx.fillStyle = "#fbf9f4";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(12, 2.8);
  ctx.lineTo(12, 10.7);
  ctx.strokeStyle = "#fbf9f4";
  ctx.lineWidth = 1.1;
  ctx.stroke();

  ctx.restore();
}

export function drawParchmentBackdrop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const centerX = width / 2;
  const bgGrad = ctx.createRadialGradient(
    centerX,
    height * 0.42,
    120,
    centerX,
    height * 0.5,
    Math.max(width, height) * 0.78
  );
  bgGrad.addColorStop(0, "#f2ecdf");
  bgGrad.addColorStop(0.65, "#e8decb");
  bgGrad.addColorStop(1, "#ddd0b8");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  let seed = 4219;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 1600; i++) {
    const px = rand() * width;
    const py = rand() * height;
    const alpha = rand() * 0.035;
    ctx.fillStyle =
      i % 2 === 0
        ? `rgba(120, 88, 42, ${alpha})`
        : `rgba(44, 44, 42, ${alpha * 0.7})`;
    ctx.fillRect(px, py, 2, 2);
  }
  ctx.restore();
}

export function drawBookLeafFrame(
  ctx: CanvasRenderingContext2D,
  leafX: number,
  leafY: number,
  leafW: number,
  leafH: number
) {
  ctx.save();
  ctx.shadowColor = "rgba(38, 26, 14, 0.18)";
  ctx.shadowBlur = 44;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 18;
  drawRoundedRect(ctx, leafX, leafY, leafW, leafH, 8);
  ctx.fillStyle = "#fbf9f4";
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRect(ctx, leafX, leafY, leafW, leafH, 8);
  ctx.clip();

  const spineShadow = ctx.createLinearGradient(leafX, 0, leafX + 38, 0);
  spineShadow.addColorStop(0, "rgba(0, 0, 0, 0.11)");
  spineShadow.addColorStop(0.45, "rgba(0, 0, 0, 0.03)");
  spineShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = spineShadow;
  ctx.fillRect(leafX, leafY, 38, leafH);

  const crimsonGrad = ctx.createLinearGradient(0, leafY, 0, leafY + leafH);
  crimsonGrad.addColorStop(0, "#982b1b");
  crimsonGrad.addColorStop(1, "#6a1e12");
  ctx.fillStyle = crimsonGrad;
  ctx.fillRect(leafX, leafY, 12, leafH);
  ctx.restore();

  drawRoundedRect(ctx, leafX, leafY, leafW, leafH, 8);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(179, 139, 77, 0.55)";
  ctx.stroke();

  const inset = 18;
  drawRoundedRect(
    ctx,
    leafX + inset + 6,
    leafY + inset,
    leafW - inset * 2 - 6,
    leafH - inset * 2,
    4
  );
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(179, 139, 77, 0.25)";
  ctx.stroke();

  const fxLeft = leafX + inset + 16;
  const fxRight = leafX + leafW - inset - 10;
  const fyTop = leafY + inset + 10;
  const fyBottom = leafY + leafH - inset - 10;
  drawCornerFlourish(ctx, fxLeft, fyTop, 1, 1);
  drawCornerFlourish(ctx, fxRight, fyTop, -1, 1);
  drawCornerFlourish(ctx, fxLeft, fyBottom, 1, -1);
  drawCornerFlourish(ctx, fxRight, fyBottom, -1, -1);
}

