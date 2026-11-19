const cx = (...c) => c.filter(Boolean).join(" ");

const HEIGHT = 210;
const STROKE = 24;
// Each band swings from 45 units above its baseline to 35 below; with the stroke that stays inside the viewBox.
const wave = (y) => `M-40 ${y + 20} C 260 ${y + 35}, 560 ${y - 45}, 860 ${y - 30} S 1140 ${y + 5}, 1240 ${y - 25}`;
const BASELINES = [60, 110, 160];

/** Stacked light-blue sea waves from the logo's bottom-right quadrant. */
export default function BrandWaves({ className, color = "var(--color-sky)" }) {
  return (
    <svg className={cx("pointer-events-none", className)} viewBox={`0 0 1200 ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
      {BASELINES.map((y) => (
        <path key={y} d={wave(y)} fill="none" stroke={color} strokeWidth={STROKE} />
      ))}
    </svg>
  );
}

