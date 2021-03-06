import React from 'react'

const style = {
  cls13: { fill: 'none', stroke: '#fff', strokeLinecap: 'round' as any },
  cls1: { strokeLinejoin: 'linejoin', strokeWidth: '2px' },
  cls2: { fill: '#fff' },
  cls3: { strokeMiterlimit: '10', strokeWidth: '1.2px' },
}
const cls1 = Object.assign({}, style.cls13, style.cls1)
const cls3 = Object.assign({}, style.cls13, style.cls3)

const ReservationIcon = ({ ...restProps }) => (
  <svg width="200" height="150" viewBox="0 0 99.21 99.21" {...restProps}>
    <g id="Ebene_1" data-name="Ebene 1">
      <path
        style={cls1}
        d="M82.84,64.79H29A2.23,2.23,0,0,1,26.85,63L20.39,34.42H78.76L85,61.95A2.29,2.29,0,0,1,82.84,64.79Z"
      />
      <path
        style={cls1}
        d="M76.76,34.42H20.39L14.25,59a2.29,2.29,0,0,0,2.13,2.9h5.7"
      />
      <path
        style={style.cls2}
        d="M29.22,45.66h2.84a2.17,2.17,0,0,1,2.36,1.61c.28,1.14-.44,1.43-.61,1.5v0A1.47,1.47,0,0,1,35,50.05a3.39,3.39,0,0,0,.71,1.57H34.6a2,2,0,0,1-.37-.88c-.27-1.09-.61-1.58-1.57-1.58H31.12l.61,2.45h-1Zm1.71,2.71h1.71c.66,0,.94-.33.78-1a1.13,1.13,0,0,0-1.26-.91H30.47Z"
      />
      <path
        style={style.cls2}
        d="M35.5,45.66h4.28l.22.9H36.76l.38,1.56h3l.21.85h-3l.43,1.74h3.3l.22.9H37Z"
      />
      <path
        style={style.cls2}
        d="M42.83,49.63a1.71,1.71,0,0,0,1.82,1.28c.92,0,1.15-.45,1-.9a1,1,0,0,0-.67-.73c-.46-.16-1-.27-1.9-.49a2.08,2.08,0,0,1-1.69-1.51c-.29-1.19.67-1.75,1.74-1.75a2.69,2.69,0,0,1,2.75,1.9h-1a1.45,1.45,0,0,0-1.54-1.05c-.48,0-1,.17-.9.78a1.11,1.11,0,0,0,.9.77l1.83.46a2.18,2.18,0,0,1,1.53,1.52c.33,1.33-.72,1.87-1.9,1.87a2.89,2.89,0,0,1-3-2.13Z"
      />
      <path
        style={style.cls2}
        d="M47,45.66h4.28l.22.9H48.25l.39,1.56h3l.21.85h-3l.43,1.74h3.3l.22.9H48.45Z"
      />
      <path
        style={style.cls2}
        d="M52.65,45.66h2.84a2.17,2.17,0,0,1,2.36,1.61c.28,1.14-.44,1.43-.61,1.5v0a1.47,1.47,0,0,1,1.19,1.26,3.38,3.38,0,0,0,.71,1.57H58a2,2,0,0,1-.37-.88c-.27-1.09-.61-1.58-1.57-1.58H54.56l.61,2.45h-1Zm1.71,2.71h1.71c.66,0,.94-.33.78-1a1.13,1.13,0,0,0-1.26-.91H53.9Z"
      />
      <path
        style={style.cls2}
        d="M58.11,45.66h1.08l2.66,4.71h0l.36-4.71h1.06l-.56,6H61.56Z"
      />
      <path
        style={style.cls2}
        d="M64.29,45.66h4.28l.22.9H65.55l.39,1.56h3l.21.85h-3l.43,1.74h3.3l.22.9H65.76Z"
      />
      <path
        style={style.cls2}
        d="M70,45.66h2.46a3.49,3.49,0,0,1,3.36,3c.41,1.64-.06,3-1.89,3H71.43Zm2.3,5.1h1c1.63,0,1.75-.93,1.46-2.13a2.36,2.36,0,0,0-2.51-2.13h-1Z"
      />
      <line style={cls3} x1="29.41" y1="54.51" x2="77.27" y2="54.51" />
      <line style={cls3} x1="27.24" y1="42.86" x2="75.1" y2="42.86" />
    </g>
  </svg>
)

export default ReservationIcon
