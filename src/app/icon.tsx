import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: '#f8f4ec', // vintage-ivory
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#982b1b', // poetry red color
          fontFamily: 'serif',
          fontWeight: 'bold',
          borderRadius: '4px',
          border: '1px solid #b38b4d', // antique-gold
        }}
      >
        D
      </div>
    ),
    {
      ...size,
    }
  );
}
