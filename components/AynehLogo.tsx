export default function AynehLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ayneh Beauty"
      className={className}
    >
      <circle cx="20" cy="20" r="19" fill="white" />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="900"
        fontSize="22"
        fill="#0a0a0a"
      >
        A
      </text>
    </svg>
  );
}