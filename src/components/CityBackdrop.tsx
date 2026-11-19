/**
 * 极淡的街区线稿，只做底纹。不是另一张业务地图，也不带发光色块。
 */
export function CityBackdrop() {
  return (
    <svg
      className="city-backdrop pointer-events-none"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="1920" height="1080" fill="#07182f" />
      <g fill="none" stroke="#c5ddf0" strokeOpacity="0.28" strokeWidth="1">
        <path d="M0 216H1920M0 504H1920M0 792H1920" />
        <path d="M288 0V1080M768 0V1080M1248 0V1080M1632 0V1080" />
      </g>
    </svg>
  );
}
