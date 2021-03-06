import React from 'react'
import { useTheme } from '@allthings/elements/Theme'

// @TODO: Hack till those elements are available by default in TS world.
// https://github.com/Microsoft/TypeScript/issues/15449
declare global {
  namespace JSX {
    // tslint:disable:interface-name
    interface IntrinsicElements {
      fecolormatrix: React.DetailedHTMLProps<any, any>
      fecomposite: React.DetailedHTMLProps<any, any>
      fegaussianblur: React.DetailedHTMLProps<any, any>
      femorphology: React.DetailedHTMLProps<any, any>
      feoffset: React.DetailedHTMLProps<any, any>
    }
    // tslint:enable:interface-name
  }
}

const BookingFailureIcon = () => {
  const { theme } = useTheme()
  const highlightColor = theme.primary
  return (
    <svg
      width="225"
      height="216"
      viewBox="0 0 225 216"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <path
          d="M79.9579561,158.972048 C36.0632761,158.972048 0.477374005,123.470821 0.477374005,79.6805855 C0.477374005,35.8903503 36.0632761,0.389122688 79.9579561,0.389122688 C123.852636,0.389122688 159.438538,35.8903503 159.438538,79.6805855 C159.438538,123.470821 123.852636,158.972048 79.9579561,158.972048 Z"
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
          <femorphology
            radius="15"
            operator="dilate"
            in="SourceAlpha"
            result="shadowSpreadOuter1"
          >
            <feoffset in="shadowSpreadOuter1" result="shadowOffsetOuter1">
              <fegaussianblur
                stdDeviation="7"
                in="shadowOffsetOuter1"
                result="shadowBlurOuter1"
              >
                <fecomposite
                  in="shadowBlurOuter1"
                  in2="SourceAlpha"
                  operator="out"
                  result="shadowBlurOuter1"
                >
                  <fecolormatrix
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                    in="shadowBlurOuter1"
                  />
                </fecomposite>
              </fegaussianblur>
            </feoffset>
          </femorphology>
        </filter>
        <filter
          x="-15.5%"
          y="-27.3%"
          width="128.4%"
          height="153.4%"
          filterUnits="objectBoundingBox"
          id="filter-3"
        >
          <feOffset
            dx="0"
            dy="0"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          />
          <feGaussianBlur
            stdDeviation="5"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.05 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <path
          d="M186.671556,156.538146 L149.694866,82.5847652 C148.647193,80.5017449 145.226849,80.5017449 144.179176,82.5847652 L107.202486,156.538146 C106.179464,158.602678 107.695508,161 109.963412,161 L183.916793,161 C186.184696,161 187.700741,158.602678 186.671556,156.538146 Z"
          id="path-3"
        />
      </defs>
      <g id="Booking" fill="none" fillRule="evenodd">
        <g id="Booking---FAILED" transform="translate(-49 -113)">
          <g id="DETAIL">
            <g id="INTRO" transform="translate(38 128)">
              <g
                id="ICON"
                filter="url(#filter-3)"
                transform="translate(25.000000, 13.000000)"
              >
                <g id="Shape" fillRule="nonzero">
                  <use
                    fill="#000"
                    filter="url(#filter-2)"
                    xlinkHref="#path-1"
                  />
                  <use fill="#E3F2EF" fillRule="evenodd" xlinkHref="#path-1" />
                  <path
                    stroke="#FFF"
                    strokeWidth="15"
                    d="M79.9579561,166.472048 C31.9251349,166.472048 -7.02262599,127.616961 -7.02262599,79.6805855 C-7.02262599,31.7442098 31.9251349,-7.11087731 79.9579561,-7.11087731 C127.990777,-7.11087731 166.938538,31.7442098 166.938538,79.6805855 C166.938538,127.616961 127.990777,166.472048 79.9579561,166.472048 Z"
                  />
                </g>
                <g id="Group-17" transform="translate(1 1)">
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
                  <g id="Group" transform="translate(33.94 23.577)">
                    <path
                      d="M83.5024503,75.6433961 C83.5024503,79.5729232 80.3588286,82.7165449 76.4293015,82.7165449 L8.0555305,82.7165449 C4.12600343,82.7165449 0.982381768,79.5729232 0.982381768,75.6433961 L0.982381768,30.8467875 C0.982381768,26.9172604 4.12600343,23.7736388 8.0555305,23.7736388 L76.4293015,23.7736388 C80.3588286,23.7736388 83.5024503,26.9172604 83.5024503,30.8467875 L83.5024503,75.6433961 Z"
                      id="Shape"
                      fill="#00B8F0"
                      fillRule="nonzero"
                    />
                    <path
                      d="M50.8873756,23.5771624 L8.0555305,23.5771624 C4.12600343,23.5771624 0.982381768,26.7207841 0.982381768,30.6503112 L0.982381768,73.4821562 L50.8873756,23.5771624 Z"
                      id="Shape"
                      fill="#4ACFFF"
                      fillRule="nonzero"
                    />
                    <path
                      d="M24.5595442,60.1217642 C22.0053516,60.1217642 19.8441117,57.9605243 19.8441117,55.4063317 L19.8441117,54.6204263 L15.1286792,59.3358588 L15.1286792,60.1217642 C15.1286792,62.6759568 17.2899191,64.8371967 19.8441117,64.8371967 L78.7870178,64.8371967 C81.3412104,64.8371967 83.5024503,62.6759568 83.5024503,60.1217642 L24.5595442,60.1217642 Z"
                      id="Shape"
                      fill="#009FD9"
                      fillRule="nonzero"
                    />
                    <polygon
                      id="Shape"
                      fill="#009FD9"
                      fillRule="nonzero"
                      points="19.8441117 23.5771624 15.1286792 23.5771624 15.1286792 59.5323351 19.8441117 54.8169027"
                    />
                    <path
                      d="M83.5024503,75.6433961 C83.5024503,79.5729232 80.3588286,82.7165449 76.4293015,82.7165449 L8.0555305,82.7165449 C4.12600343,82.7165449 0.982381768,79.5729232 0.982381768,75.6433961 L0.982381768,30.8467875 C0.982381768,26.9172604 4.12600343,23.7736388 8.0555305,23.7736388 L76.4293015,23.7736388 C80.3588286,23.7736388 83.5024503,26.9172604 83.5024503,30.8467875 L83.5024503,75.6433961 Z"
                      id="Shape"
                      stroke="#45413C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M76.4293015,82.5200685 C80.3588286,82.5200685 83.5024503,79.3764469 83.5024503,75.4469198 L83.5024503,73.0892035 L0.982381768,73.0892035 L0.982381768,75.4469198 C0.982381768,79.3764469 4.12600343,82.5200685 8.0555305,82.5200685 L76.4293015,82.5200685 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#FFF"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polygon
                      id="Shape"
                      fill="#E0E0E0"
                      fillRule="nonzero"
                      points="49.3155648 92.1474098 35.1692673 92.1474098 36.3481254 82.5200685 48.1367066 82.5200685"
                    />
                    <polygon
                      id="Shape"
                      fill="#87898C"
                      fillRule="nonzero"
                      points="48.5296593 86.2531192 35.9551727 86.2531192 36.3481254 82.5200685 48.1367066 82.5200685"
                    />
                    <polygon
                      id="Shape"
                      stroke="#45413C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="49.3155648 92.1474098 35.1692673 92.1474098 36.3481254 82.5200685 48.1367066 82.5200685"
                    />
                    <path
                      d="M57.5675716,96.666366 L26.9172604,96.666366 C26.9172604,94.1121734 29.0785003,91.9509335 31.6326929,91.9509335 L52.8521391,91.9509335 C55.4063317,92.1474098 57.5675716,94.1121734 57.5675716,96.666366 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#FFF"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M88.2178828,55.7992844 C88.2178828,58.353477 86.0566429,60.5147169 83.5024503,60.5147169 L24.5595442,60.5147169 C22.0053516,60.5147169 19.8441117,58.353477 19.8441117,55.7992844 L19.8441117,15.7181083 L88.2178828,15.7181083 L88.2178828,55.7992844 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#DAEDF7"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M88.2178828,15.7181083 L19.8441117,15.7181083 L19.8441117,6.28724331 C19.8441117,3.73305072 22.0053516,1.57181083 24.5595442,1.57181083 L83.5024503,1.57181083 C86.0566429,1.57181083 88.2178828,3.73305072 88.2178828,6.28724331 L88.2178828,15.7181083 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#FFF"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      id="Oval"
                      stroke="#45413C"
                      fill="#FF6242"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      cx="26.917"
                      cy="8.645"
                      r="2.358"
                    />
                    <circle
                      id="Oval"
                      stroke="#45413C"
                      fill="#FFF48C"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      cx="36.348"
                      cy="8.645"
                      r="2.358"
                    />
                    <circle
                      id="Oval"
                      stroke="#45413C"
                      fill="#6DD627"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      cx="45.779"
                      cy="8.645"
                      r="2.358"
                    />
                    <path
                      d="M50.4944229,37.3305072 C50.4944229,38.5093653 49.7085175,39.2952707 48.5296593,39.2952707 L43.0283214,39.2952707 C41.8494633,39.2952707 41.0635579,38.5093653 41.0635579,37.3305072 L41.0635579,31.8291693 C41.0635579,30.6503112 41.8494633,29.8644057 43.0283214,29.8644057 L48.5296593,29.8644057 C49.7085175,29.8644057 50.4944229,30.6503112 50.4944229,31.8291693 L50.4944229,37.3305072 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#6DD627"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M65.8195785,37.3305072 C65.8195785,38.5093653 65.033673,39.2952707 63.8548149,39.2952707 L58.353477,39.2952707 C57.1746189,39.2952707 56.3887135,38.5093653 56.3887135,37.3305072 L56.3887135,31.8291693 C56.3887135,30.6503112 57.1746189,29.8644057 58.353477,29.8644057 L63.8548149,29.8644057 C65.033673,29.8644057 65.8195785,30.6503112 65.8195785,31.8291693 L65.8195785,37.3305072 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#FF6242"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M81.144734,37.3305072 C81.144734,38.5093653 80.3588286,39.2952707 79.1799705,39.2952707 L73.6786326,39.2952707 C72.4997745,39.2952707 71.7138691,38.5093653 71.7138691,37.3305072 L71.7138691,31.8291693 C71.7138691,30.6503112 72.4997745,29.8644057 73.6786326,29.8644057 L79.1799705,29.8644057 C80.3588286,29.8644057 81.144734,30.6503112 81.144734,31.8291693 L81.144734,37.3305072 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#6DD627"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M50.4944229,51.2803283 C50.4944229,52.4591864 49.7085175,53.2450918 48.5296593,53.2450918 L43.0283214,53.2450918 C41.8494633,53.2450918 41.0635579,52.4591864 41.0635579,51.2803283 L41.0635579,45.7789904 C41.0635579,44.6001323 41.8494633,43.8142269 43.0283214,43.8142269 L48.5296593,43.8142269 C49.7085175,43.8142269 50.4944229,44.6001323 50.4944229,45.7789904 L50.4944229,51.2803283 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#FF6242"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M65.8195785,51.2803283 C65.8195785,52.4591864 65.033673,53.2450918 63.8548149,53.2450918 L58.353477,53.2450918 C57.1746189,53.2450918 56.3887135,52.4591864 56.3887135,51.2803283 L56.3887135,45.7789904 C56.3887135,44.6001323 57.1746189,43.8142269 58.353477,43.8142269 L63.8548149,43.8142269 C65.033673,43.8142269 65.8195785,44.6001323 65.8195785,45.7789904 L65.8195785,51.2803283 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#6DD627"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M81.144734,51.2803283 C81.144734,52.4591864 80.3588286,53.2450918 79.1799705,53.2450918 L73.6786326,53.2450918 C72.4997745,53.2450918 71.7138691,52.4591864 71.7138691,51.2803283 L71.7138691,45.7789904 C71.7138691,44.6001323 72.4997745,43.8142269 73.6786326,43.8142269 L79.1799705,43.8142269 C80.3588286,43.8142269 81.144734,44.6001323 81.144734,45.7789904 L81.144734,51.2803283 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#FFE500"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M36.3481254,23.1842097 C36.3481254,24.3630678 35.56222,25.1489733 34.3833619,25.1489733 L28.882024,25.1489733 C27.7031659,25.1489733 26.9172604,24.3630678 26.9172604,23.1842097 L26.9172604,22.3983043 C26.9172604,21.2194462 27.7031659,20.4335408 28.882024,20.4335408 L34.3833619,20.4335408 C35.56222,20.4335408 36.3481254,21.2194462 36.3481254,22.3983043 L36.3481254,23.1842097 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#00B8F0"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M81.144734,23.1842097 C81.144734,24.3630678 80.3588286,25.1489733 79.1799705,25.1489733 L43.0283214,25.1489733 C41.8494633,25.1489733 41.0635579,24.3630678 41.0635579,23.1842097 L41.0635579,22.3983043 C41.0635579,21.2194462 41.8494633,20.4335408 43.0283214,20.4335408 L79.1799705,20.4335408 C80.3588286,20.4335408 81.144734,21.2194462 81.144734,22.3983043 L81.144734,23.1842097 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#00B8F0"
                      fillRule="nonzero"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.9172604,29.6679294 L36.3481254,29.6679294"
                      id="Shape"
                      stroke="#45413C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.9172604,34.3833619 L36.3481254,34.3833619"
                      id="Shape"
                      stroke="#45413C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.9172604,39.2952707 L36.3481254,39.2952707"
                      id="Shape"
                      stroke="#45413C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.9172604,44.0107032 L36.3481254,44.0107032"
                      id="Shape"
                      stroke="#45413C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.9172604,48.7261357 L36.3481254,48.7261357"
                      id="Shape"
                      stroke="#45413C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.9172604,53.2450918 L32.8115511,53.2450918"
                      id="Shape"
                      stroke="#45413C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M103.543038,78.9834941 C103.150086,80.1623523 102.560657,80.3588286 101.971228,79.1799705 L94.3086497,60.7111933 C93.7192207,59.5323351 94.3086497,58.9429061 95.4875078,59.5323351 L113.956285,67.1949129 C115.135143,67.784342 115.135143,68.3737711 113.759809,68.7667238 L107.865518,70.3385346 C106.68666,70.7314873 105.311326,71.9103454 104.918373,73.2856799 L103.543038,78.9834941 Z"
                      id="Shape"
                      stroke="#45413C"
                      fill="#FFF"
                      fillRule="nonzero"
                      strokeLinejoin="round"
                    />
                    <circle
                      id="Oval"
                      stroke="#45413C"
                      fill="#DAEDF7"
                      fillRule="nonzero"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      cx="42.242"
                      cy="77.805"
                      r="1"
                    />
                    <ellipse
                      id="Oval"
                      fill="#45413C"
                      fillRule="nonzero"
                      opacity=".15"
                      cx="42.242"
                      cy="98.238"
                      rx="29.864"
                      ry="2.947"
                    />
                  </g>
                </g>
                <g id="Shape" fillRule="nonzero">
                  <use
                    fill={highlightColor || '#FF5500'}
                    fillRule="evenodd"
                    xlinkHref="#path-3"
                  />
                  <path
                    stroke="#FFF"
                    strokeWidth="10"
                    d="M191.143692,154.302078 L191.14636,154.307423 C193.830762,159.692299 189.903325,166 183.916793,166 L109.963412,166 C103.981697,166 100.054581,159.701901 102.73035,154.302078 L139.712339,80.338131 C142.60645,74.5839563 151.267591,74.5839563 154.167002,80.3486972 L191.143692,154.302078 Z"
                  />
                </g>
                <path
                  d="M146.940102,148.674437 C145.239174,148.674437 143.858711,147.293973 143.858711,145.593046 C143.858711,143.885955 145.239174,142.511655 146.940102,142.511655 C148.64103,142.511655 150.021493,143.885955 150.021493,145.593046 C150.021493,147.293973 148.64103,148.674437 146.940102,148.674437 Z"
                  id="Path"
                  fill="#FFF"
                />
                <path
                  d="M150.021493,136.348873 C150.021493,138.049801 148.64103,139.430264 146.940102,139.430264 C145.239174,139.430264 143.858711,138.049801 143.858711,136.348873 L143.858711,114.779137 C143.858711,113.072046 145.239174,111.697746 146.940102,111.697746 C148.64103,111.697746 150.021493,113.072046 150.021493,114.779137 L150.021493,136.348873 Z"
                  id="Path"
                  fill="#FFF"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default BookingFailureIcon
