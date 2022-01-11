import React from 'react'
import { ColorPalette } from '@allthings/colors'

interface IProps {
  color: string
  onClick?: OnClick
  style: object
}

const AllthingsLogo = ({
  color = ColorPalette.white,
  style,
  ...props
}: IProps) => (
  <svg
    width="74"
    height="15"
    viewBox="0 0 74 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    {...props}
  >
    <path
      d="M25.6444 11.5747L25.1616 10.0115C25.1272 9.89652 25.0237 9.82756 24.9088 9.82756H22.0122C21.8973 9.82756 21.7938 9.90802 21.7594 10.0115L21.2766 11.5747C21.2076 11.8046 20.9892 11.9655 20.7479 11.9655H19.4605C19.2881 11.9655 19.1617 11.7931 19.2191 11.6322L22.2191 3.11493C22.2651 2.99998 22.3685 2.91953 22.495 2.91953H24.426C24.5525 2.91953 24.6559 2.99998 24.7019 3.11493L27.7134 11.6322C27.7708 11.7931 27.6444 11.9655 27.472 11.9655H26.1846C25.9318 11.9655 25.7249 11.8046 25.6444 11.5747ZM24.5295 8.21836C24.5984 8.21836 24.6444 8.1494 24.6214 8.09193C24.0467 6.22986 23.7134 5.17239 23.6444 4.91952C23.6214 4.85056 23.6099 4.79308 23.5869 4.73561C23.5525 4.62067 23.3915 4.62067 23.357 4.73561C23.1731 5.39078 22.8283 6.50573 22.3456 8.09193C22.3226 8.1494 22.3685 8.21836 22.4375 8.21836H24.5295Z"
      fill="#95A5A5"
    />
    <path
      d="M30.1959 11.9654H28.8396C28.6901 11.9654 28.5752 11.8505 28.5752 11.7011V2.63213C28.5752 2.48271 28.6901 2.36777 28.8396 2.36777H30.1959C30.3453 2.36777 30.4603 2.48271 30.4603 2.63213V11.7011C30.4603 11.8505 30.3338 11.9654 30.1959 11.9654Z"
      fill="#95A5A5"
    />
    <path
      d="M34.047 11.9654H32.6906C32.5412 11.9654 32.4263 11.8505 32.4263 11.7011V2.63213C32.4263 2.48271 32.5412 2.36777 32.6906 2.36777H34.047C34.1964 2.36777 34.3113 2.48271 34.3113 2.63213V11.7011C34.3113 11.8505 34.1964 11.9654 34.047 11.9654Z"
      fill="#95A5A5"
    />
    <path
      d="M39.1392 10.5862C39.3921 10.5862 39.6795 10.5402 40.0013 10.4598C40.1622 10.4138 40.3231 10.5402 40.3231 10.7127V11.5977C40.3231 11.7012 40.2542 11.8046 40.1507 11.8391C39.7139 12 39.1967 12.0805 38.5875 12.0805C37.8404 12.0805 37.2887 11.8851 36.9438 11.5058C36.599 11.1264 36.4266 10.5517 36.4266 9.79312V6.72416C36.4266 6.58623 36.3117 6.45979 36.1622 6.45979H35.7829C35.645 6.45979 35.5186 6.34485 35.5186 6.19542V5.80462C35.5186 5.71266 35.5645 5.6322 35.645 5.58623C36.2312 5.22991 36.691 4.67818 36.9323 4.03451L37.0358 3.74715C37.0703 3.6437 37.1737 3.57474 37.2772 3.57474H38.0358C38.1737 3.57474 38.3002 3.68968 38.3002 3.83911V4.79312C38.3002 4.93106 38.4151 5.05749 38.5645 5.05749H39.9783C40.1162 5.05749 40.2427 5.17244 40.2427 5.32186V6.21841C40.2427 6.35634 40.1277 6.48278 39.9783 6.48278H38.5645C38.4266 6.48278 38.3002 6.59772 38.3002 6.74714V9.80461C38.3002 10.069 38.3806 10.2644 38.53 10.4023C38.691 10.5287 38.8864 10.5862 39.1392 10.5862Z"
      fill="#95A5A5"
    />
    <path
      d="M47.632 11.9654H46.2757C46.1263 11.9654 46.0113 11.8505 46.0113 11.7011V7.94247C46.0113 6.94247 45.6435 6.44822 44.8964 6.44822C44.3677 6.44822 43.9883 6.63213 43.7585 6.98845C43.5286 7.34477 43.4021 7.93097 43.4021 8.72408V11.7011C43.4021 11.8505 43.2872 11.9654 43.1378 11.9654H41.7815C41.632 11.9654 41.5171 11.8505 41.5171 11.7011V2.63213C41.5171 2.48271 41.632 2.36777 41.7815 2.36777H43.1378C43.2872 2.36777 43.4021 2.48271 43.4021 2.63213V4.32179C43.4021 4.47121 43.3906 4.82753 43.3562 5.39075L43.3447 5.60914V5.63213C43.3447 5.75856 43.5056 5.81604 43.5861 5.71259C44.0113 5.19535 44.6205 4.94247 45.4136 4.94247C46.2182 4.94247 46.8389 5.16086 47.2527 5.59764C47.6665 6.03443 47.8849 6.65511 47.8849 7.4712V11.7011C47.8964 11.8505 47.7814 11.9654 47.632 11.9654Z"
      fill="#95A5A5"
    />
    <path
      d="M49.5068 3.28731C49.5068 2.67811 49.8517 2.36777 50.5298 2.36777C51.208 2.36777 51.5528 2.67811 51.5528 3.28731C51.5528 3.57466 51.4723 3.80455 51.2999 3.96546C51.1275 4.12638 50.8746 4.20684 50.5298 4.20684C49.8517 4.20684 49.5068 3.90799 49.5068 3.28731ZM51.1965 11.9654H49.8632C49.7137 11.9654 49.5873 11.839 49.5873 11.6896V5.34477C49.5873 5.19535 49.7137 5.06891 49.8632 5.06891H51.1965C51.3459 5.06891 51.4723 5.19535 51.4723 5.34477V11.6896C51.4723 11.839 51.3459 11.9654 51.1965 11.9654Z"
      fill="#95A5A5"
    />
    <path
      d="M59.3686 11.9656H58.0123C57.8628 11.9656 57.7479 11.8506 57.7479 11.7012V7.94257C57.7479 7.44832 57.6559 7.06901 57.4835 6.82763C57.3111 6.57476 57.0238 6.45981 56.6444 6.45981C56.1157 6.45981 55.7364 6.63223 55.5065 6.98855C55.2766 7.34487 55.1502 7.91958 55.1502 8.73567V11.7127C55.1502 11.8621 55.0353 11.977 54.8858 11.977H53.5295C53.3801 11.977 53.2651 11.8621 53.2651 11.7127V5.34487C53.2651 5.19545 53.3801 5.08051 53.5295 5.08051H54.5065C54.6215 5.08051 54.7249 5.16097 54.7594 5.27591L54.9088 5.79315V5.80464C54.9433 5.90809 55.0697 5.93108 55.1387 5.85062L55.1502 5.83913C55.3456 5.57476 55.61 5.35637 55.9318 5.20694C56.2996 5.03453 56.7134 4.95407 57.1847 4.95407C57.9893 4.95407 58.5985 5.17246 59.0123 5.60924C59.426 6.04602 59.6329 6.66671 59.6329 7.4828V11.7127C59.6329 11.8506 59.5065 11.9656 59.3686 11.9656Z"
      fill="#95A5A5"
    />
    <path
      d="M67.2764 11.977C67.2764 12.9655 66.989 13.7242 66.4143 14.2299C65.8396 14.7471 64.9775 15 63.8281 15C62.9086 15 62.1155 14.8851 61.4373 14.6552C61.3224 14.6207 61.2534 14.5173 61.2534 14.3908V13.4828C61.2534 13.2989 61.4373 13.1609 61.6097 13.2184C62.3454 13.4828 63.1155 13.6092 63.9316 13.6092C64.8971 13.6092 65.3798 13.092 65.3798 12.046V11.9196C65.3798 11.9081 65.3798 11.9081 65.3798 11.8966L65.4143 11.4483V11.4368C65.4143 11.3104 65.2534 11.2414 65.1729 11.3449C64.7477 11.8391 64.1614 12.0805 63.4258 12.0805C62.5982 12.0805 61.9546 11.7586 61.5063 11.1265C61.0465 10.4943 60.8281 9.62072 60.8281 8.52877C60.8281 7.40233 61.058 6.51728 61.5293 5.88509C62.0005 5.25291 62.6442 4.94257 63.4718 4.94257C64.2419 4.94257 64.8511 5.21843 65.3224 5.77015L65.3339 5.78165C65.4028 5.8621 65.5408 5.82762 65.5637 5.72417V5.71268L65.6327 5.31038C65.6557 5.18394 65.7706 5.0805 65.8971 5.0805H66.989C67.1385 5.0805 67.2649 5.20693 67.2649 5.35636V11.977H67.2764ZM64.104 10.6092C64.6097 10.6092 64.966 10.4598 65.1844 10.1724C65.4028 9.88509 65.5063 9.41382 65.5063 8.75865V8.52877C65.5063 7.79313 65.3913 7.2644 65.1614 6.94256C64.9316 6.62072 64.5637 6.4598 64.058 6.4598C63.1729 6.4598 62.7362 7.14946 62.7362 8.54026C62.7362 9.22991 62.8511 9.74715 63.0695 10.092C63.2994 10.4483 63.6327 10.6092 64.104 10.6092Z"
      fill="#95A5A5"
    />
    <path
      d="M73.8058 9.91956C73.8058 10.6322 73.5644 11.1609 73.0702 11.5402C72.5759 11.9081 71.8403 12.092 70.8633 12.092C70.3576 12.092 69.9323 12.0575 69.5759 11.9885C69.2886 11.931 69.0242 11.8621 68.7599 11.7586C68.6564 11.7127 68.5759 11.6207 68.5759 11.5058V10.5517C68.5759 10.3563 68.7713 10.2299 68.9438 10.2989C69.1966 10.3908 69.461 10.4828 69.7598 10.5517C70.1966 10.6667 70.5874 10.7127 70.9208 10.7127C71.5989 10.7127 71.9438 10.5173 71.9438 10.1265C71.9438 9.97703 71.8978 9.86208 71.8058 9.77013C71.7139 9.67818 71.5644 9.57473 71.3346 9.45979C71.1162 9.34484 70.8173 9.20691 70.4495 9.04599C69.9208 8.8276 69.53 8.62071 69.2771 8.42531C69.0242 8.2299 68.8518 8.02301 68.7369 7.77014C68.6219 7.52876 68.5645 7.22991 68.5645 6.86209C68.5645 6.2529 68.8058 5.77014 69.2771 5.43681C69.7484 5.10347 70.4265 4.93106 71.3001 4.93106C72.0472 4.93106 72.7713 5.08048 73.4725 5.36784C73.6104 5.42531 73.6794 5.58623 73.6219 5.72416L73.2656 6.58623C73.2081 6.72416 73.0472 6.79313 72.9093 6.73565C72.6564 6.63221 72.415 6.55175 72.1851 6.47129C71.8863 6.37933 71.5759 6.33336 71.2656 6.33336C70.7139 6.33336 70.438 6.48278 70.438 6.78163C70.438 6.95404 70.53 7.09198 70.7024 7.21841C70.8748 7.34485 71.2771 7.52876 71.8748 7.77014C72.415 7.98853 72.8058 8.19542 73.0587 8.37933C73.3116 8.56324 73.4955 8.78163 73.6104 9.0345C73.7483 9.27588 73.8058 9.57473 73.8058 9.91956Z"
      fill="#95A5A5"
    />
    <path
      d="M9.67787 1.36778L9.10316 0.402263C8.94224 0.0919186 8.71236 0.0919189 8.51696 0.0919189H7.33305C7.14914 0.0919189 7.04569 0.287321 7.13765 0.436746L7.71236 1.41376C7.87328 1.71261 8.10316 1.71261 8.28707 1.71261H9.47098C9.65489 1.7241 9.75833 1.5287 9.67787 1.36778Z"
      fill="#95A5A5"
    />
    <path
      d="M12.7472 1.36778L12.1725 0.402263C12.0116 0.0919186 11.7817 0.0919189 11.5863 0.0919189H10.4024C10.2185 0.0919189 10.115 0.287321 10.207 0.436746L10.7817 1.41376C10.9426 1.71261 11.1725 1.71261 11.3564 1.71261H12.5403C12.7242 1.7241 12.8392 1.5287 12.7472 1.36778Z"
      fill="#95A5A5"
    />
    <path
      d="M14.3449 4.11494L13.7702 3.14943C13.6092 2.83908 13.3793 2.83908 13.1839 2.83908H12C11.8161 2.83908 11.7127 3.03448 11.8046 3.18391L12.3794 4.16092C12.5403 4.45977 12.7702 4.45977 12.9541 4.45977H14.138C14.3219 4.45977 14.4368 4.26437 14.3449 4.11494Z"
      fill="#95A5A5"
    />
    <path
      d="M11.2765 4.11494L10.7018 3.14943C10.5409 2.83908 10.311 2.83908 10.1156 2.83908H8.93168C8.74778 2.83908 8.64433 3.03448 8.73628 3.18391L9.31099 4.16092C9.47191 4.45977 9.7018 4.45977 9.8857 4.45977H11.0696C11.2535 4.45977 11.3685 4.26437 11.2765 4.11494Z"
      fill="#95A5A5"
    />
    <path
      d="M8.24135 4.11494L7.66664 3.14943C7.50572 2.83908 7.27583 2.83908 7.08043 2.83908H5.89653C5.71262 2.83908 5.60917 3.03448 5.70113 3.18391L6.27584 4.16092C6.43676 4.45977 6.66664 4.45977 6.85055 4.45977H8.03445C8.21836 4.45977 8.3333 4.26437 8.24135 4.11494Z"
      fill="#95A5A5"
    />
    <path
      d="M12.8615 6.8506L12.2868 5.88508C12.1258 5.57474 11.896 5.57474 11.7005 5.57474H10.5166C10.3327 5.57474 10.2293 5.77014 10.3212 5.91956L10.896 6.89657C11.0569 7.19542 11.2868 7.19542 11.4707 7.19542H12.6546C12.85 7.19542 12.9534 7.00002 12.8615 6.8506Z"
      fill="#95A5A5"
    />
    <path
      d="M9.83923 6.8506L9.26452 5.88508C9.1036 5.57474 8.87371 5.57474 8.67831 5.57474H7.5059C7.32199 5.57474 7.21855 5.77014 7.3105 5.91956L7.88521 6.89657C8.04613 7.19542 8.27602 7.19542 8.45992 7.19542H9.64383C9.81624 7.19542 9.93118 7.00002 9.83923 6.8506Z"
      fill="#95A5A5"
    />
    <path
      d="M6.67831 1.41387L6.05762 0.356405C6.05762 0.356405 6.05762 0.356404 6.05762 0.34491L6.67831 1.41387Z"
      fill="#95A5A5"
    />
    <path d="M13.2412 5.94247L13.2759 6.0119L13.2412 5.94247Z" fill="#95A5A5" />
    <path
      d="M16.0691 7.12642L16.0346 7.05746L15.299 5.7816C15.184 5.63217 15.0461 5.5862 14.9197 5.56321H13.4254C13.4139 5.56321 13.3909 5.56321 13.3794 5.5747C13.23 5.62068 13.161 5.79309 13.2415 5.93102L13.2875 5.99999L14.0116 7.26435C14.0576 7.33332 14.0576 7.42527 14.0116 7.49424L11.4024 11.8161C11.3565 11.885 11.2875 11.931 11.207 11.931H5.52888C5.44842 11.931 5.36796 11.885 5.33348 11.8161L2.12659 6.33332C2.08061 6.26436 2.08061 6.1724 2.12659 6.09194L4.6898 1.89655C4.73578 1.82758 4.80474 1.78161 4.8852 1.78161H5.18405H6.47141C6.66681 1.78161 6.78175 1.57471 6.6898 1.4023L6.05761 0.333334C5.8852 1.04137e-06 5.63233 0 5.42543 0H4.13808H3.82773C3.74727 0 3.66681 0.0459769 3.63233 0.114942L0.138085 5.82757C-0.0458224 6.13792 -0.0343285 6.33332 0.103602 6.55171L4.12658 13.4368C4.2875 13.7126 4.44842 13.7701 4.59785 13.7701H4.74727H11.9427C12.299 13.7701 12.3909 13.6896 12.5519 13.4483L16.0461 7.67815C16.161 7.49424 16.2185 7.3678 16.0691 7.12642Z"
      fill="#95A5A5"
    />
  </svg>
)

export default AllthingsLogo