import React from 'react';
import { AbsoluteFill, Composition, Img, registerRoot, staticFile, useCurrentFrame } from 'remotion';
import { canvas, duration, fps, viewport } from './format.mjs';

function BrowserReel({ frames }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#45362d' }}>
      <div style={{ ...viewport, overflow: 'hidden', borderRadius: 8, boxShadow: '0 18px 50px #0b0907a0, 0 0 0 1px #ffffff1c' }}>
        {frames[frame] && <Img src={staticFile(frames[frame])} style={{ display: 'block', ...viewport }} />}
      </div>
    </AbsoluteFill>
  );
}

function Root() {
  return (
    <Composition
      id="SereinReel"
      component={BrowserReel}
      durationInFrames={duration * fps}
      fps={fps}
      {...canvas}
      defaultProps={{ frames: [] }}
    />
  );
}

registerRoot(Root);
