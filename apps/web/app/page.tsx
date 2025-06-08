import type { JSX } from 'react';

export default function Page(): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100svh',
        backgroundColor: 'red',
      }}
    >
      <p style={{ color: 'white' }}>hello</p>
    </div>
  );
}
