import React from 'react'

const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={265} height={234} {...props}>
    <title>Error_Desktop</title>
    <defs>
      <filter
        x="-9.7%"
        y="-15.4%"
        width="118.6%"
        height="130.3%"
        filterUnits="objectBoundingBox"
        id="a"
      >
        <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation={7}
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g filter="url(#a)" transform="translate(15 25)">
        <ellipse
          stroke="#FFF"
          strokeWidth={15}
          fill="#C5E8EF"
          fillRule="nonzero"
          cx={117.503}
          cy={93.561}
          rx={93.503}
          ry={93.561}
        />
        <g fillRule="nonzero">
          <path
            d="M207.155 94c0-49.152-40.14-89-89.655-89-49.514 0-89.655 39.848-89.655 89a88.072 88.072 0 0 0 7.988 36.713h163.334A88.107 88.107 0 0 0 207.155 94z"
            fill="#BDFBFC"
          />
          <path
            d="M35.833 130.713C49.92 161.543 81.176 183 117.5 183s67.58-21.456 81.667-52.287H35.833z"
            fill="#FCEFD9"
          />
          <path
            d="M195.067 138.5c1.477-2.53 2.874-5.109 4.1-7.787H35.833c1.224 2.678 2.623 5.257 4.1 7.787h155.134z"
            fill="#FFF5E3"
          />
        </g>
        <g
          stroke="#45413C"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4}
        >
          <path d="M14 130.713h208.004M0 130.713h5.603M229.397 130.713H235" />
        </g>
        <g>
          <g transform="translate(92 60)">
            <ellipse
              fill="#45413C"
              fillRule="nonzero"
              opacity={0.15}
              cx={72.604}
              cy={86.636}
              rx={72.327}
              ry={4.559}
            />
            <path
              d="M133.025 67.88H12.183a3.031 3.031 0 0 0-3.02 3.04v6.656h126.883V70.92a3.031 3.031 0 0 0-3.02-3.04z"
              stroke="#45413C"
              fill="#F0F0F0"
              fillRule="nonzero"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M136.046 77.576H9.162a11.616 11.616 0 0 0 10.399 6.464h106.138c4.365 0 8.371-2.486 10.323-6.415l.024-.049z"
              stroke="#45413C"
              fill="#BDBEC0"
              fillRule="nonzero"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M126.409 6.096c0-3.358-2.704-6.079-6.042-6.079H24.84c-3.338 0-6.042 2.72-6.042 6.079V67.88h107.61V6.096z"
              fill="#00B8F0"
              fillRule="nonzero"
            />
            <path
              d="M24.841.017c-3.338 0-6.042 2.72-6.042 6.079V67.88h.61L86.868.017H24.84z"
              fill="#4ACFFF"
              fillRule="nonzero"
            />
            <path
              d="M126.409 6.096c0-3.358-2.707-6.079-6.042-6.079H24.84c-3.335 0-6.042 2.72-6.042 6.079V67.88h107.61V6.096z"
              stroke="#45413C"
            />
          </g>
          <g fillRule="nonzero" stroke="#45413C">
            <path
              d="M49.106 95.194l11.96-7.844 3.484-17.875a2.008 2.008 0 0 0-1.96-2.398 2 2 0 0 0-1.711.97L46.83 91.409l2.276 3.785z"
              fill="#6DD627"
            />
            <path
              d="M32.594 87.35l19.475 12.773-19.287-32.076a2 2 0 0 0-1.712-.97 2.018 2.018 0 0 0-1.963 2.398l3.487 17.875z"
              fill="#6DD627"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M66.313 85.668a2.003 2.003 0 0 0-2.415-.173l-29.137 19.11H58.84l7.954-16.547a2.032 2.032 0 0 0-.48-2.39z"
              fill="#9CEB60"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M46.83 91.409l6.043-10.054-4.063-19.411a2.001 2.001 0 0 0-1.92-1.597h-.036c-.915 0-1.715.627-1.94 1.525L40.28 80.518l6.55 10.89z"
              fill="#46B000"
            />
            <path
              d="M58.903 104.6L29.767 85.49a2.003 2.003 0 0 0-2.415.173 2.016 2.016 0 0 0-.476 2.387l7.953 16.546h24.074v.004z"
              fill="#9CEB60"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M60.667 122.704H32.674l-2.92-13.208a4.04 4.04 0 0 1 .785-3.391 3.987 3.987 0 0 1 3.119-1.505h26.021a4 4 0 0 1 3.12 1.505 4.04 4.04 0 0 1 .783 3.391l-2.915 13.208zM32.674 122.704h27.993v8.046H32.674z"
              fill="#FFF"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
      <g stroke="#45413C" strokeLinejoin="round">
        <path
          d="M60.003 17.948c0-3.285 2.653-5.948 5.924-5.948h65.15c3.27 0 5.923 2.663 5.923 5.948v46.093c0 3.285-2.652 5.948-5.924 5.948h-20.73v6.574a3.442 3.442 0 0 1-2.112 3.175 3.411 3.411 0 0 1-3.73-.746l-8.966-9.003H65.924c-3.272 0-5.924-2.663-5.924-5.948V17.948h.003z"
          fill="#FFF"
          fillRule="nonzero"
        />
        <path d="M74 32h33M74 43h45M74 53h45" strokeLinecap="round" />
      </g>
      <g transform="translate(122 1)">
        <ellipse
          fill="#FF6242"
          fillRule="nonzero"
          cx={13.467}
          cy={13.596}
          rx={13.467}
          ry={13.474}
        />
        <path
          d="M13.467 5.737c6.475 0 11.877 4.574 13.17 10.667.19-.908.296-1.844.296-2.808 0-7.441-6.028-13.473-13.466-13.473S0 6.155 0 13.596c0 .964.105 1.903.296 2.808C1.59 10.309 6.991 5.737 13.466 5.737z"
          fill="#FF866E"
          fillRule="nonzero"
        />
        <ellipse
          stroke="#45413C"
          strokeLinecap="round"
          strokeLinejoin="round"
          cx={13.467}
          cy={13.596}
          rx={13.467}
          ry={13.474}
        />
        <path
          d="M13.467 5.737v6.737"
          stroke="#FFF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.467 17.526a2.246 2.246 0 0 0 0 4.492 2.246 2.246 0 0 0 0-4.492z"
          fill="#FFF"
          fillRule="nonzero"
        />
      </g>
    </g>
  </svg>
)

export default SvgComponent
