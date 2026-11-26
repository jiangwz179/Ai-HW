import React, { useMemo } from 'react';
import { FoodScores, CriticType } from '../types';

interface RadarChartProps {
  scores: FoodScores;
  critic: CriticType;
}

const AXES = [
  { key: 'color', label: '色澤外觀', icon: '🎨' },
  { key: 'aroma', label: '香氣撲鼻', icon: '♨️' },
  { key: 'taste', label: '風味口感', icon: '👅' },
  { key: 'portion', label: '份量飽足', icon: '🥣' },
  { key: 'value', label: 'CP 性價比', icon: '🪙' },
] as const;

export const RadarChart: React.FC<RadarChartProps> = ({ scores, critic }) => {
  const size = 320;
  const center = size / 2;
  const maxRadius = 100;
  const levels = 5; // 2, 4, 6, 8, 10

  // Colors based on critic
  const theme = useMemo(() => {
    switch (critic) {
      case 'toxic':
        return {
          stroke: '#ff007f',
          fill: 'rgba(255, 0, 127, 0.28)',
          glow: 'rgba(255, 0, 127, 0.7)',
          point: '#ff007f',
        };
      case 'cozy':
        return {
          stroke: '#ffe600',
          fill: 'rgba(255, 230, 0, 0.25)',
          glow: 'rgba(255, 230, 0, 0.65)',
          point: '#ffe600',
        };
      case 'michelin':
      default:
        return {
          stroke: '#00f3ff',
          fill: 'rgba(0, 243, 255, 0.25)',
          glow: 'rgba(0, 243, 255, 0.65)',
          point: '#00f3ff',
        };
    }
  }, [critic]);

  // Compute (x, y) on the radar
  const getCoordinates = (value: number, index: number, total: number, radius = maxRadius) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (Math.max(0, Math.min(value, 10)) / 10) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate web rings
  const webRings = useMemo(() => {
    return Array.from({ length: levels }, (_, lvl) => {
      const radius = ((lvl + 1) / levels) * maxRadius;
      const points = AXES.map((_, i) => {
        const { x, y } = getCoordinates(10, i, AXES.length, radius);
        return `${x},${y}`;
      }).join(' ');
      return { radius, points, label: (lvl + 1) * 2 };
    });
  }, []);

  // Compute active score polygon points
  const scorePoints = useMemo(() => {
    return AXES.map((axis, i) => {
      const val = scores[axis.key] ?? 5;
      const { x, y } = getCoordinates(val, i, AXES.length);
      return { x, y, value: val, label: axis.label, icon: axis.icon };
    });
  }, [scores]);

  const polygonPath = useMemo(() => {
    return scorePoints.map(p => `${p.x},${p.y}`).join(' ');
  }, [scorePoints]);

  return (
    <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center mx-auto select-none">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full overflow-visible drop-shadow-lg"
      >
        <defs>
          <filter id={`radar-glow-${critic}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concentric Polygons / Grid Lines */}
        {webRings.map((ring, idx) => (
          <polygon
            key={idx}
            points={ring.points}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={idx === levels - 1 ? 1.5 : 1}
            strokeDasharray={idx === levels - 1 ? undefined : '2 2'}
          />
        ))}

        {/* Spokes / Axis Lines */}
        {AXES.map((_, i) => {
          const { x, y } = getCoordinates(10, i, AXES.length, maxRadius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* Glowing Value Polygon */}
        <polygon
          points={polygonPath}
          fill={theme.fill}
          stroke={theme.stroke}
          strokeWidth="2.5"
          filter={`url(#radar-glow-${critic})`}
          className="transition-all duration-700 ease-out"
        />

        {/* Data Vertices / Points */}
        {scorePoints.map((pt, i) => (
          <g key={i} className="group">
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill={theme.point}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-700 ease-out cursor-pointer hover:r-6"
            />
            {/* Small tooltips on hover */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="12"
              fill="transparent"
              className="cursor-pointer"
            >
              <title>{`${pt.label}: ${pt.value.toFixed(1)} 分`}</title>
            </circle>
          </g>
        ))}

        {/* Axis Labels & Icons */}
        {AXES.map((axis, i) => {
          const angle = (Math.PI * 2 / AXES.length) * i - Math.PI / 2;
          const labelDist = maxRadius + 26;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const scoreVal = scores[axis.key] ?? 0;

          return (
            <g key={axis.key} className="text-center">
              <text
                x={lx}
                y={ly - 5}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#cbd5e1"
                fontSize="11"
                fontWeight="700"
                className="font-sans pointer-events-none"
              >
                {axis.icon} {axis.label}
              </text>
              <text
                x={lx}
                y={ly + 10}
                textAnchor="middle"
                dominantBaseline="central"
                fill={theme.stroke}
                fontSize="11"
                fontWeight="800"
                className="font-mono pointer-events-none"
              >
                {scoreVal.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
