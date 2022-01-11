import React from 'react'

const OnboardingCameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="246" height="246" viewBox="0 0 246 246" {...props}>
    <defs>
      <filter
        x="-19.1%"
        y="-14.8%"
        width="138.8%"
        height="133.2%"
        filterUnits="objectBoundingBox"
        id="a"
      >
        <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="7"
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
      <path
        d="M94.237 195.45c-51.784 0-93.763-42.01-93.763-93.834 0-51.824 41.98-93.836 93.763-93.836C146.02 7.78 188 49.792 188 101.616c0 24.886-9.88 48.754-27.463 66.352-17.584 17.597-41.433 27.483-66.3 27.483z"
        id="b"
      />
    </defs>
    <g
      filter="url(#a)"
      transform="translate(29 21)"
      fillRule="nonzero"
      fill="none"
    >
      <path
        d="M11.574 145.935c16.32 30.502 48.087 49.542 82.66 49.542 34.572 0 66.34-19.04 82.66-49.542H11.573z"
        fill="#5ABF8E"
      />
      <use fill="#D7F4ED" fillRule="evenodd" xlinkHref="#b" />
      <path
        stroke="#FFF"
        strokeWidth="15"
        d="M94.237 202.95c-55.928 0-101.263-45.37-101.263-101.334C-7.026 45.65 38.31.28 94.237.28 150.164.28 195.5 45.65 195.5 101.616c0 26.874-10.668 52.65-29.657 71.653-18.99 19.004-44.748 29.68-71.606 29.68z"
      />
      <path
        d="M158.717 33.49c-36.162-34.276-92.79-34.276-128.953 0h128.953z"
        fill="#D8ECE8"
      />
      <path
        d="M158.717 33.49c-36.162-34.276-92.79-34.276-128.953 0h128.953z"
        fill="#C5EFE7"
      />
      <path
        d="M9 140.745c15.272 33.36 48.574 54.75 85.24 54.75 36.667 0 69.97-21.39 85.242-54.75H9z"
        fill="#5ABF8E"
      />
      <path
        d="M34.466 173.912c34.683 28.72 84.866 28.72 119.548 0H34.466z"
        fill="#2CB57D"
      />
      <path
        d="M170.64 133.498l-.57-.722c-4.984-6.496-11-9.578-16.98-9.318-5.978-.26-11.993 2.836-16.977 9.318l-.57.722c-1.11 1.608-1.682 3.525-1.637 5.48 0 3.853 1.868 6.98 4.176 6.98h29.968c2.308 0 4.176-3.127 4.176-6.98.06-1.95-.495-3.866-1.587-5.48zM59.177 144.21h-35.71c-2.885 0-5.207-3.797-5.207-8.48-.072-2.393.634-4.744 2.012-6.7 11.576-14.66 30.524-14.66 42.1 0 1.378 1.956 2.084 4.307 2.012 6.7 0 4.69-2.33 8.48-5.207 8.48z"
        fill="#0E381E"
      />
      <path
        d="M181.12 136.948H16.42l.094 9 160.335.088c1.584-2.95 3.01-5.984 4.27-9.088z"
        fill="#0E381E"
      />
      <path
        d="M178.487 133.866c-4.01-.173-8.05 1.906-11.396 6.258l-.38.498c-.745 1.09-1.124 2.386-1.083 3.703 0 2.592 1.255 4.685 2.798 4.685h6.75c2.742-4.678 5.07-9.585 6.96-14.667-1.18-.365-2.414-.526-3.648-.477z"
        fill="#056738"
      />
      <path
        d="M59.956 107.166c-.722 8.186-20.297 26.664-27.9 39.022l34.066-.1c1.573-8.577 6.427-17.195 7.934-22.897 2.517-9.672 6.225-15.157 6.225-15.157.808-4.656-19.38-11.116-20.324-.867z"
        fill="#F0957D"
      />
      <path
        d="M32.057 146.195l34.065-.1c5.45-12.41 10.168-25.13 14.13-38.09.396-2.21-10.596 20.8-21.825 29.903-12.22 9.904-22.403 1.834-26.37 8.287z"
        fill="#E18679"
      />
      <path
        d="M130.696 103.21c-.418 1.798 8.735 30.678 16.66 42.833h-26.83c-1.795-8.532-4.897-37.007-4.897-37.007-.96-4.598 17.382-15.85 15.066-5.825z"
        fill="#F0957D"
      />
      <path
        d="M124.075 86.645c1.06.238-2.568-10.72 2.532-14.364-2.164 1.524 7.934.65 6.686 3.314-.67 1.437-6.246 11.722-9.218 11.05z"
        fill="#CC644B"
      />
      <path
        d="M134.627 146.007h-14.115c-1.796-8.532-4.897-37.007-4.897-37.007-.505-2.426 2.25 6.742 6.68 18.276 3.432 8.943 12.332 18.73 12.332 18.73z"
        fill="#E18679"
      />
      <path
        d="M134.26 104.33c-5.93 6.575-6.24 5.962-10.423 4.958-.252-.057 1.565-10.062 4.623-11.55 2.2-1.096 7.696 4.49 5.8 6.592zM136.553 85.692c-2.662 2.426-4.926 3.725-7.523 2.166-1.97-1.213-1.738-5.962.873-6.136 2.61-.173 6.845 1.668 6.217 3.126-.627 1.458 1.255.094.433.844zM51.553 103.045c5.77 6.742 7.35 8.936 11.54 8.055 1.587-.332-3.058-10.062-4.948-11.058-2.135-1.155-8.43.837-6.592 3.003zM59.256 97.22c1.385-.852-.815-4.894-2.943-5.053-2.603-.21-5.878 2.166-5.272 3.61.607 1.443 4.552 3.695 8.216 1.443zM52.202 85.765c2.496 2.598 4.667 4.05 7.364 2.634 2.04-1.076 2.164-5.833-.454-6.18-2.618-.346-6.94 1.206-6.412 2.7.526 1.494-1.262.043-.498.845zM53.962 68.52c1.442 3.314 5.828 14.025 8.85 13.643-1.082.137 3.606-10.423-1.125-14.538 1.976 1.718-6.932-1.313-6.96.275-.03 1.588-1.205-.383-.765.62z"
        fill="#CC644B"
      />
      <path
        d="M80.057 69.46H66.57l.46-1.784c.152-.387.524-.64.94-.642h10.695c.415 0 .786.255.938.642l.454 1.783zM117.836 70.635H90.494l2.885-7.297c.618-1.58 2.14-2.62 3.836-2.62h13.927c1.696 0 3.218 1.04 3.837 2.62l2.856 7.297zM57.907 87.728v17.194c-.076 5.602 4.4 10.206 9.997 10.285h52.65c5.6-.08 10.074-4.683 9.998-10.285V87.728c.006-.402-.148-.79-.428-1.078-.28-.29-.663-.454-1.065-.46H59.4c-.402.006-.785.17-1.065.46-.28.288-.434.676-.428 1.078z"
        fill="#0B1731"
      />
      <path
        d="M130.566 88.673V77.91c.065-4.684-3.677-8.535-8.36-8.603H66.275c-2.25.03-4.395.954-5.964 2.568-1.57 1.614-2.434 3.785-2.403 6.036v10.763h72.66z"
        fill="#F4E5D9"
      />
      <ellipse fill="#F0957D" cx="94.237" cy="92.846" rx="15.341" ry="15.353" />
      <ellipse fill="#F4E5D9" cx="94.237" cy="92.846" rx="12.031" ry="12.04" />
      <ellipse fill="#0B1731" cx="94.237" cy="92.846" rx="9.29" ry="9.297" />
      <ellipse fill="#0B1731" cx="112.824" cy="78.987" rx="1.659" ry="1.66" />
      <path
        d="M52.303 86.63c-2.17-1.845-2.67-5-1.176-7.427.077-.115.16-.228.246-.34 2.048-2.684 8.482-1.103 12.91-.815 8.33.535 9.13-.18 8.583 2.787-.462 2.504-2.647 5.11-9.81 4.872-7.16-.238-9.938-.49-8.214 2.353l-2.54-1.43z"
        fill="#F0957D"
      />
      <path
        d="M62.696 84.38c4.69.663 6.722.374 6.722.374-1.4.657-3.476 1.04-6.375.938-7.17-.238-9.94-.49-8.216 2.354-.805-.288-1.56-.697-2.243-1.213-.9-.657.03-3.89 10.112-2.454z"
        fill="#E18679"
      />
      <path
        d="M50.716 95.668c-2.12-1.855-2.322-5.493-.65-6.88 2.612-2.164 7.935-1.508 12.37-1.053 8.194.837 9.42.23 8.728 2.887-.642 2.47-3.426 4.916-10.574 4.33-7.147-.583-10.032-.858-8.352 2.015l-1.522-1.3zM54.74 69.885c-1.68-2.26-1.802-4.75.152-6.77l.303-.29c2.517-2.26 4.443-.577 8.713.664l4.227 1.147c1.442.397 4.99.686 3.397 3.35-1.306 2.165-3.607 4.33-10.458 2.31-6.852-2.022-6.333-.412-6.333-.412z"
        fill="#F0957D"
      />
      <path
        d="M70.818 65.352c.22.072.396.24.477.46.082.216.06.46-.06.658-.994 1.58-2.805 1.076-5.618.174-1.03-.332-.764-1.307-.418-1.992.222-.435.72-.65 1.19-.513 2.17.634 3.324.85 4.428 1.212zM71.445 78.344c.134.01.257.08.333.19.076.112.097.252.057.38-.613 2.036-2.683 2.108-5.77 1.906-1.443-.094-1.205-1.82-1.126-2.468.05-.426.822-.434 1.377-.383 1.63.187 3.86.374 5.128.374z"
        fill="#F7A692"
      />
      <path
        d="M54.777 93.15c4.003.186 8.98 1.442 14.15.446-1.63 1.097-4.233 1.704-8.337 1.386-7.147-.556-10.032-.86-8.352 2.014l-1.276-1.17c-.585-.52-.513-2.887 3.815-2.677zM60.078 70.015c-4.724-1.25-5.186.67-5.186.67-.34-.72-.505-1.176-.72-1.66.482-1.746 2.358-.916 5.906.99z"
        fill="#E18679"
      />
      <path
        d="M52.274 104.727c-2.127-1.84-3.318-4.33-2.495-6.692.936-2.692 4.463-3.73 8.892-3.407 8.878.722 9.91 0 9.225 2.714-.563 2.26-3.888 2.888-8.078 2.686-6.81-.34-7.142 3.29-4.387 7.557l-3.16-2.858z"
        fill="#F0957D"
      />
      <path
        d="M63.468 99.955c-3.303-.72-6.49-.873-8.655-.057-2.95 1.09-3.563 3.818-1.84 5.442l2.69 2.47c-2.754-4.267-2.682-8.107 4.12-7.782 1.228.072 2.46.048 3.685-.073z"
        fill="#E18679"
      />
      <path
        d="M67.132 95.2c.106.013.2.073.258.164.057.09.07.202.038.304-.217 1.148-1.868 1.306-4.328 1.097-1.125-.094-.78-1.047-.678-1.566.028-.142.14-.25.282-.276.287-.04.578-.04.865 0 1.305.152 2.538.21 3.562.275zM69.96 88.45c.135.008.26.08.336.193.076.113.096.255.053.384-.62 2.036-2.237 1.956-5.31 1.747-1.442-.094-1.247-1.862-1.132-2.512.028-.18.167-.322.346-.354.362-.05.728-.05 1.09 0 1.615.138 3.346.47 4.615.542z"
        fill="#F7A692"
      />
      <path
        d="M128.742 96.332c-1.32-.946 1.175-4.822 3.31-4.83 2.61 0 5.705 2.578 4.99 3.993-.713 1.414-4.81 3.35-8.3.837z"
        fill="#CC644B"
      />
      <path
        d="M133.906 74.403c1.16-2.353.332-5.32-.39-6.106-2.28-2.498-4.37-1.004-8.734-.18l-4.328.72c-1.493.254-5.048 0-3.728 2.838 1.09 2.302 3.144 4.692 10.184 3.32 7.04-1.37 6.996-.592 6.996-.592z"
        fill="#F0957D"
      />
      <path
        d="M117.764 69.286c-.476.108-.772.462-.555.895.828 1.675 2.675 1.365 5.567.76 1.06-.225.9-1.214.627-1.936-.173-.455-.627-.55-1.11-.462-2.23.42-3.397.49-4.53.744z"
        fill="#F7A692"
      />
      <path
        d="M122.67 75.4c1.96.13 5.596-.658 7.305-.766 3.606-.23 3.318.96 3.318.96.404-.722.396-.722.642-1.184-.296-1.782-6.304-.59-11.266.99z"
        fill="#E18679"
      />
      <path
        d="M136.07 86.732c2.257-1.682 2.286-4.584.973-7.074-1.37-2.606-7.602-2.47-12.045-2.483-8.352 0-9.095-.794-8.748 2.202.295 2.533 2.3 5.276 9.462 5.514 7.162.24 9.947.174 8.042 2.888l2.316-1.046z"
        fill="#F0957D"
      />
      <path
        d="M126.31 83.873c-4.73.275-6.858-.346-6.858-.346 1.35.722 3.397 1.27 6.296 1.364 7.17.24 9.947.174 8.042 2.888.822-.233 1.602-.59 2.316-1.06.908-.585.194-3.43-9.795-2.845z"
        fill="#E18679"
      />
      <path
        d="M117.887 77.06c-.135-.002-.264.06-.348.165-.086.105-.117.244-.086.376.454 2.08 2.322 2.29 5.402 2.325 1.443 0 1.342-1.718 1.313-2.375 0-.426-.787-.49-1.343-.483-1.63.03-3.67.036-4.94-.007z"
        fill="#F7A692"
      />
      <path
        d="M137.375 95.408c2.25-1.69 2.72-5.313 1.154-6.807-2.446-2.337-7.82-2.085-12.262-1.962-8.23.23-9.377-.462-8.915 2.238.462 2.504 3.05 5.16 10.22 5.132 7.17-.03 10.098-.116 8.18 2.62l1.622-1.22z"
        fill="#F0957D"
      />
      <path
        d="M133.516 92.6c-4.003-.108-9.06.722-14.143-.6 1.543 1.22 4.096 2.015 8.207 1.993 7.17 0 10.098-.115 8.18 2.62l1.348-1.068c.635-.462.736-2.83-3.592-2.945z"
        fill="#E18679"
      />
      <path
        d="M118.76 86.717c-.135-.003-.264.056-.35.16-.086.105-.12.243-.09.375.425 2.086 2.04 2.165 5.12 2.252 1.443.043 1.443-1.733 1.37-2.39-.01-.18-.135-.334-.31-.382-.353-.085-.717-.12-1.08-.108-1.646-.008-3.398.15-4.66.093z"
        fill="#F7A692"
      />
      <path
        d="M134.39 105.24c2.783-2.044 4.067-5.176 3.31-7.55-.866-2.715-4.328-3.856-8.792-3.653-8.223.382-10.48 0-9.002 2.887 1.09 2.115 4.025 3.046 7.768 2.822 6.802-.41 6.643 3.458 3.772 7.644l2.943-2.15z"
        fill="#F0957D"
      />
      <path
        d="M123.808 99.486c3.325-.657 6.694-.635 8.872.238 2.885 1.17 3.447 3.913 1.687 5.493l-2.942 2.166c2.885-4.187 3.094-7.774-3.715-7.637-1.306.068-2.616-.02-3.902-.26z"
        fill="#E18679"
      />
      <path
        d="M120.67 94.462c-.113.015-.214.078-.277.174-.062.096-.08.215-.047.324.217 1.235 1.753 1.336 4.328 1.14 1.204-.086.85-1.11.72-1.666-.024-.154-.142-.275-.295-.304-.307-.042-.618-.042-.924 0-1.32.152-2.43.275-3.505.332z"
        fill="#F7A692"
      />
      <path
        d="M51.156 10.263c1.195.14 2.328.607 3.275 1.35.37.26.643-.166.722-.556.386-2.05 1.724-3.79 3.602-4.693 1.878-.902 4.073-.856 5.91.124.242.12.52.132.77.034.25-.097.448-.296.544-.547C67.37 2.597 69.238.2 73.118.2c4.422 0 6.672 3.09 7.617 7.22.045.215.192.395.394.483.202.087.434.07.622-.044 1.83-1.156 4.145-1.22 6.037-.168 1.89 1.053 3.057 3.054 3.043 5.22 0 3.277-2.164 7.095-8.136 7.095-2.597 0-26.81.13-29.175 0-5.51-.303-6.643-2.793-6.643-5.153 0-2.36 1.918-4.59 4.276-4.59zM180.52 45.805c-.915.108-1.783.465-2.51 1.032-.28.202-.49-.123-.548-.426-.303-1.57-1.333-2.903-2.774-3.595-1.442-.69-3.125-.66-4.54.088-.184.096-.4.107-.594.03-.193-.075-.344-.23-.415-.427-1.068-2.59-2.504-4.417-5.475-4.417-3.397 0-5.12 2.374-5.842 5.55-.034.165-.147.304-.302.372-.154.067-.332.055-.476-.033-1.4-.885-3.17-.936-4.62-.136-1.448.8-2.348 2.326-2.348 3.982 0 2.512 1.645 5.443 6.246 5.443 1.99 0 20.578.092 22.36 0 4.226-.232 5.1-2.167 5.1-3.957.014-1.85-1.417-3.39-3.26-3.508zM10.528 50.915c.252-2.567 2.175-4.656 4.71-5.117 2.538-.46 5.072.818 6.21 3.132.395.766 1.318 1.092 2.106.744 1.475-.59 3.16-.235 4.273.9 1.113 1.136 1.434 2.83.815 4.295-.62 1.463-2.057 2.412-3.646 2.405h-14.39c-1.585.017-2.913-1.202-3.03-2.786-.12-1.585 1.012-2.988 2.584-3.206.116-.022.34-.015.368-.37z"
        fill="#EFE7DF"
      />
      <path
        d="M43.82 138.342l-.677-.527c-5.723-4.457-12.816-6.787-20.065-6.59-5.73-.143-11.387 1.29-16.358 4.143 1.566 4.068 3.414 8.02 5.532 11.83H40.8c2.103-.003 3.974-1.342 4.657-3.333.683-1.992.03-4.198-1.63-5.495l-.006-.028z"
        fill="#056738"
      />
    </g>
  </svg>
)

export default OnboardingCameraIcon
