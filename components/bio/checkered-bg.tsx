export function CheckeredBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <pattern id="checkerboard" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" x="0" y="0" fill="#E8453C" />
            <rect width="50" height="50" x="50" y="0" fill="#F0851E" />
            <rect width="50" height="50" x="0" y="50" fill="#F0A01E" />
            <rect width="50" height="50" x="50" y="50" fill="#D93B2B" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#checkerboard)" />
      </svg>
    </div>
  )
}
