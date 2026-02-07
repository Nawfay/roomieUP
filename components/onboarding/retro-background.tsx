export function RetroBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Top-right swooping arcs */}
      <svg
        className="absolute -top-20 -right-20 w-[600px] h-[600px] md:w-[800px] md:h-[800px]"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M800 0 C800 0 600 50 400 250 C200 450 150 700 150 800"
          stroke="#E8593A"
          strokeWidth="40"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M800 0 C800 0 650 80 470 260 C290 440 240 680 230 800"
          stroke="#F28C38"
          strokeWidth="35"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M800 0 C800 0 700 110 540 270 C380 430 330 660 310 800"
          stroke="#F5B041"
          strokeWidth="30"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
        <path
          d="M800 0 C800 0 740 130 600 280 C460 430 410 640 390 800"
          stroke="#F9D56E"
          strokeWidth="25"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </svg>

      {/* Bottom-left swooping arcs */}
      <svg
        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
        viewBox="0 0 700 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 700 C0 700 50 500 200 350 C350 200 550 120 700 100"
          stroke="#E8593A"
          strokeWidth="35"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M0 700 C0 700 80 540 220 400 C360 260 540 190 700 170"
          stroke="#F28C38"
          strokeWidth="30"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
        <path
          d="M0 700 C0 700 110 580 240 450 C370 320 530 260 700 240"
          stroke="#F5B041"
          strokeWidth="25"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M0 700 C0 700 140 610 260 500 C380 390 520 330 700 310"
          stroke="#F9D56E"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
      </svg>
    </div>
  )
}
