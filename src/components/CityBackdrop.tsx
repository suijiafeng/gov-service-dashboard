/**
 * 低对比城市路网。线稿是示意街区，不是某座真实城市，也不是另一张业务地图。
 * 深蓝遮罩盖在上面，所以这里的线可以稍实，落到画面上仍然很淡。
 */
export function CityBackdrop() {
  return (
    <svg
      className="city-backdrop pointer-events-none"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="city-streets" width="96" height="96" patternUnits="userSpaceOnUse">
          <path d="M96 0H0V96" fill="none" stroke="#b7d2ea" strokeOpacity="0.28" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1920" height="1080" fill="#07182f" />
      <rect width="1920" height="1080" fill="url(#city-streets)" />
      <g fill="none" stroke="#c5ddf0" strokeOpacity="0.42" strokeWidth="1.4">
        <path d="M0 216H1920M0 504H1920M0 792H1920" />
        <path d="M288 0V1080M768 0V1080M1248 0V1080M1632 0V1080" />
        <path d="M0 980L420 620M1500 160L1920 520" strokeOpacity="0.28" />
      </g>
      <g fill="none" stroke="#d5e6f5" strokeOpacity="0.34" strokeWidth="1.2">
        <rect x="48" y="72" width="168" height="96" />
        <rect x="72" y="248" width="120" height="160" />
        <rect x="336" y="248" width="200" height="88" />
        <rect x="360" y="560" width="144" height="128" />
        <rect x="96" y="848" width="220" height="72" />
        <rect x="1568" y="96" width="200" height="88" />
        <rect x="1680" y="280" width="128" height="176" />
        <rect x="1504" y="536" width="176" height="104" />
        <rect x="1648" y="824" width="184" height="96" />
        <rect x="840" y="920" width="240" height="64" />
      </g>
      <path
        fill="none"
        stroke="#d7e7f6"
        strokeOpacity="0.4"
        strokeWidth="1.25"
        d="M0 1016V972H36V1000H68V908H108V968H156V860H196V948H248V1004H304V924H352V988H408V896H452V960H512V1016H576V940H624V1000H688V884H736V956H792V1016H860V932H916V988H984V1016H1048V908H1096V972H1160V1016H1224V936H1280V992H1344V868H1392V952H1456V1016H1520V924H1576V980H1640V1016H1704V900H1752V964H1816V1012H1864V948H1920V1016"
      />
    </svg>
  );
}
