import { audioEngine } from '../services/audioEngine.js';
import { state } from '../services/state.js';

export function setupVisualizer(canvasElement) {
  if (!canvasElement) return;
  const ctx = canvasElement.getContext('2d');
  let animationId = null;

  function render() {
    animationId = requestAnimationFrame(render);

    const width = canvasElement.width;
    const height = canvasElement.height;
    ctx.clearRect(0, 0, width, height);

    if (!state.state.isPlaying) {
      // Draw resting idle bars
      const numBars = 16;
      const barWidth = width / numBars - 1.5;
      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 1.5);
        const barHeight = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      }
      return;
    }

    const freqData = audioEngine.getFrequencyData();
    const numBars = 16;
    const step = Math.floor(freqData.length / numBars / 2);
    const barWidth = (width / numBars) - 1.5;

    for (let i = 0; i < numBars; i++) {
      const val = freqData[i * step] || 0;
      const percent = val / 255;
      const barHeight = Math.max(2, percent * height);
      const x = i * (barWidth + 1.5);
      const y = height - barHeight;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]) : ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fill();
    }
  }

  render();

  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}
