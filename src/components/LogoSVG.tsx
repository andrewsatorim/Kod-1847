export default function LogoSVG({ size = 160 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <rect className="anim-outer" x="1" y="1" width="158" height="158" stroke="#b89860" strokeWidth="1" />
      <rect className="anim-inner" x="10" y="10" width="140" height="140" stroke="#b89860" strokeWidth="0.5" opacity="0.3" />
      <path className="anim-diamond" d="M80 18 L87 25 L80 32 L73 25 Z" fill="#b89860" />
      <g className="anim-k">
        <line x1="42" y1="52" x2="42" y2="112" stroke="#b89860" strokeWidth="2.2" />
        <line x1="42" y1="82" x2="70" y2="52" stroke="#b89860" strokeWidth="2.2" />
        <line x1="42" y1="82" x2="70" y2="112" stroke="#b89860" strokeWidth="2.2" />
      </g>
      <line className="anim-div" x1="84" y1="55" x2="84" y2="109" stroke="#b89860" strokeWidth="0.5" opacity="0.25" />
      <text className="anim-18" x="108" y="78" fontFamily="'Bodoni Moda',Georgia,serif" fontSize="23" fill="#b89860" fontWeight="400" textAnchor="middle">18</text>
      <text className="anim-47" x="108" y="105" fontFamily="'Bodoni Moda',Georgia,serif" fontSize="23" fill="#b89860" fontWeight="400" textAnchor="middle" style={{ paintOrder: "stroke fill", WebkitTextStroke: "0.3px #b89860" } as React.CSSProperties}>47</text>
    </svg>
  );
}
