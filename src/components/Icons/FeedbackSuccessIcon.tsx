import React from 'react'
import { useTheme } from '@allthings/elements/Theme'

const FeedbackSuccessIcon = () => {
  const { theme } = useTheme()
  return (
    <svg
      width="227"
      height="217"
      viewBox="0 0 227 217"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <path
          d="M93.9579561,158.972048 C50.0632761,158.972048 14.477374,123.470821 14.477374,79.6805855 C14.477374,35.8903503 50.0632761,0.389122688 93.9579561,0.389122688 C137.852636,0.389122688 173.438538,35.8903503 173.438538,79.6805855 C173.438538,123.470821 137.852636,158.972048 93.9579561,158.972048 Z"
          id="path-1"
        />
        <filter
          x="-22.6%"
          y="-22.7%"
          width="145.3%"
          height="145.4%"
          filterUnits="objectBoundingBox"
          id="filter-2"
        >
          <feMorphology
            radius="15"
            operator="dilate"
            in="SourceAlpha"
            result="shadowSpreadOuter1"
          />
          <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
          <feGaussianBlur
            stdDeviation="7"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feComposite
            in="shadowBlurOuter1"
            in2="SourceAlpha"
            operator="out"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            in="shadowBlurOuter1"
          />
        </filter>
      </defs>
      <g id="Page-1" fill="none" fillRule="evenodd">
        <g id="ICON" transform="translate(15 29)">
          <g id="Shape" fillRule="nonzero">
            <use fill="#000" filter="url(#filter-2)" xlinkHref="#path-1" />
            <path
              stroke="#FFF"
              strokeWidth="15"
              d="M93.9579561,166.472048 C45.9251349,166.472048 6.97737401,127.616961 6.97737401,79.6805855 C6.97737401,31.7442098 45.9251349,-7.11087731 93.9579561,-7.11087731 C141.990777,-7.11087731 180.938538,31.7442098 180.938538,79.6805855 C180.938538,127.616961 141.990777,166.472048 93.9579561,166.472048 Z"
              fill="#E3F2EF"
              fillRule="evenodd"
            />
          </g>
          <g id="Group-17" transform="translate(15 1)">
            <g id="Group" fillRule="nonzero">
              <g id="Shape">
                <path
                  d="M157.181083,78.5905414 C157.181083,35.1692673 122.011816,0 78.5905414,0 C35.1692673,0 0,35.1692673 0,78.5905414 C0,90.1826463 2.5541926,101.185322 7.07314873,111.00914 L150.30441,111.00914 C154.62689,101.185322 157.181083,90.1826463 157.181083,78.5905414 Z"
                  fill="#BDFBFC"
                  transform="translate(.539)"
                />
                <path
                  d="M7.07314873,111.00914 C19.451159,138.319353 46.7613722,157.181083 78.5905414,157.181083 C110.419711,157.181083 137.9264,138.319353 150.107934,111.00914 L7.07314873,111.00914 Z"
                  fill="#FFEF9E"
                  transform="translate(.539)"
                />
                <path
                  d="M146.57136,117.885812 C147.946694,115.724572 149.125552,113.366856 150.107934,111.00914 L6.87667238,111.00914 C7.85905414,113.366856 9.23438862,115.724572 10.4132467,117.885812 L146.57136,117.885812 Z"
                  fill="#FFFACF"
                  transform="translate(.539)"
                />
              </g>
            </g>
            <g id="Group" transform="translate(31.94 28.577)">
              <g id="Shape">
                <path
                  d="M96,71.96 C96,76.4266667 92.3428571,80 87.7714286,80 L8.22857143,80 C3.65714286,80 0,76.4266667 0,71.96 L0,21.04 C0,16.5733333 3.65714286,13 8.22857143,13 L87.7714286,13 C92.3428571,13 96,16.5733333 96,21.04 L96,71.96 Z"
                  stroke="#030303"
                  fill="#FFF"
                  fillRule="nonzero"
                />
                <path
                  d="M3,77 L34.6198305,42.8281876"
                  stroke="#45413C"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M61,77 L92.5153046,43.8256968"
                  stroke="#45413C"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="matrix(-1 0 0 1 154 0)"
                />
                <path
                  d="M1.55546381,17.1788199 L38.6918274,46.269729"
                  stroke="#45413C"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M57.3859647,14.8437372 L92.5079159,45.9294515"
                  stroke="#45413C"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="matrix(-1 0 0 1 150 0)"
                />
                <path
                  d="M39,46 C43.4901154,49.3333333 46.656782,51 48.5,51 C50.343218,51 53.5098846,49.3333333 58,46"
                  stroke="#45413C"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="rotate(-1 48.5 48.5)"
                />
              </g>
              <ellipse
                id="Oval"
                fill="#45413C"
                fillRule="nonzero"
                opacity="0.15"
                cx="44.242"
                cy="93.238"
                rx="29.864"
                ry="2.947"
              />
            </g>
          </g>
          <path
            d="M193.945216,94.3035339 C199.054299,98.1296905 200.177934,105.417216 196.494826,110.676678 L161.453592,160.517184 C157.69478,165.855753 150.372703,167.056284 145.168109,163.135504 C143.623257,161.971719 139.57969,157.862589 133.030476,150.959798 C132.826234,150.74449 132.826234,150.74449 132.622091,150.529134 C130.076829,147.843591 127.376078,144.968309 124.69182,142.093313 C123.752534,141.087283 122.882297,140.153036 122.102694,139.314415 C121.829661,139.020712 121.587397,138.759875 121.378604,138.534885 C121.166728,138.3065 121.166728,138.3065 121.101839,138.236352 C116.776921,133.514943 117.002942,126.111259 121.591472,121.677172 C126.255265,117.141244 133.644687,117.36063 138.030116,122.154057 L150.620406,135.412385 L177.666916,96.9272601 C181.423998,91.5911471 188.741069,90.3892654 193.945215,94.303533 Z"
            id="Shape"
            stroke="#FFF"
            strokeWidth="10"
            fill={theme.primary}
            fillRule="nonzero"
          />
        </g>
        <path id="Path-2" stroke="#979797" />
      </g>
    </svg>
  )
}

export default FeedbackSuccessIcon
