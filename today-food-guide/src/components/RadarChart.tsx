import React, { useMemo } from 'react';
import { NutritionDecisionScores, GuideTone } from '../types';

interface RadarChartProps {
  scores: NutritionDecisionScores;
  tone: GuideTone;
}

const AXES = [
  { key: 'balance', label: '營養均衡', icon: '🥗' },
  { key: 'vegetable', label: '蔬果足量', icon: '🥬' },
  { key: 'calorieControl', label: '熱量控管', icon: '🔥' },
  { key: 'satiety', label: '飽足份量', icon: '🍚' },
  { key: 'value', label: 'CP性價比', icon: '💰' },
] as const;

export const RadarChart: React.FC<RadarChartProps> = ({ scores, tone }) => {
  const size = 320;
  const center = size / 2;
  const maxRadius = 96;
  const levels = 5;

  const theme = useMemo(() => {
    switch (tone) {
      case 'frank':
        return {
          stroke: '#ff007f',
          fill: 'rgba(255, 0, 127, 0.24)',
          point: '#ff007f',
        };
      case 'partner':
        return {
          stroke: '#fbbf24',
          fill: 'rgba(251, 191, 36, 0.22)',
          point: '#fbbf24',
        };
      case 'dietitian':
      default:
        return {
          stroke: '#22d3ee',
          fill: 'rgba(34, 211, 238, 0.24)',
          point: '#22d3ee',
        };
    }
  }, [tone]);

  const getCoordinates = (value: number, index: number, total: number, radius = maxRadius) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (Math.max(0, Math.min(value, 10)) / 10) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

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

  const scorePoints = useMemo(() => {
    return AXES.map((axis, i) => {
      const val = scores[axis.key] ?? 5;
      const { x, y } = getCoordinates(val, i, AXES.length);
      return { x, y, value: val, label: axis.label, icon: axis.icon };
    });
  }, [scores]);

  const polygonPath = useMemo(() => {
    return scorePoints.map((p) => `${p.x},${p.y}`).join(' ');
  }, [scorePoints]);

  return (
    <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center mx-auto select-none">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible drop-shadow-lg">
        <defs>
          <filter id={`radar-glow-${tone}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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

        <polygon
          points={polygonPath}
          fill={theme.fill}
          stroke={theme.stroke}
          strokeWidth="2.5"
          filter={`url(#radar-glow-${tone})`}
          className="transition-all duration-700 ease-out"
        />

        {scorePoints.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill={theme.point}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-700 ease-out"
            />
            <circle cx={pt.x} cy={pt.y} r="12" fill="transparent">
              <title>{`${pt.label}: ${pt.value.toFixed(1)} 分`}</title>
            </circle>
          </g>
        ))}

        {AXES.map((axis, i) => {
          const angle = (Math.PI * 2 / AXES.length) * i - Math.PI / 2;
          const labelDist = maxRadius + 28;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const scoreVal = scores[axis.key] ?? 0;

          return (
            <g key={axis.key}>
              <text
                x={lx}
                y={ly - 6}
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
