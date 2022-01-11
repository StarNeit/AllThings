import React from 'react'

const style = {
  cls: {
    fill: 'none',
    stroke: '#fff',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  cls1: { strokeWidth: '1.5px' },
  cls2456: { strokeWidth: '1.2px' },
  cls3: { strokeWidth: '2px' },
  cls4: { strokeDasharray: '3.5 2.1' },
  cls5: { strokeDasharray: '2.59 1.56' },
  cls6: { strokeDasharray: '3.05 1.83' },
}
const cls1 = Object.assign({}, style.cls, style.cls1)
const cls2 = Object.assign({}, style.cls, style.cls2456)
const cls3 = Object.assign({}, style.cls, style.cls3)
const cls4 = Object.assign({}, style.cls, style.cls2456, style.cls4)
const cls5 = Object.assign({}, style.cls, style.cls5)
const cls6 = Object.assign({}, style.cls, style.cls6)

const CarWashIcon = ({ ...restProps }) => (
  <svg width="200" height="150" viewBox="0 0 99.21 99.21" {...restProps}>
    <g id="Ebene_1" data-name="Ebene 1">
      <path
        style={cls1}
        d="M40.42,68.89V71.5A1.43,1.43,0,0,1,39,72.94h-2.4a1.43,1.43,0,0,1-1.43-1.43V68.89"
      />
      <path
        style={cls1}
        d="M67.52,68.89V71.5a1.43,1.43,0,0,1-1.43,1.43h-2.4a1.43,1.43,0,0,1-1.43-1.43V68.89"
      />
      <path
        style={cls1}
        d="M33.66,65.67h8A1.45,1.45,0,0,0,43,63.56h0a5.64,5.64,0,0,0-5-3.05H35"
      />
      <path
        style={cls1}
        d="M69,65.67H61a1.45,1.45,0,0,1-1.29-2.12h0a5.64,5.64,0,0,1,5-3.05h3"
      />
      <path
        style={cls2}
        d="M45.09,66.66l.71-1.23a2.18,2.18,0,0,1,1.89-1.09H55a2.18,2.18,0,0,1,1.89,1.09l.71,1.23"
      />
      <path
        style={cls1}
        d="M69.48,57.78l4-1.49a1.32,1.32,0,0,0,.86-1.24h0a1.32,1.32,0,0,0-1.32-1.32H70a1.32,1.32,0,0,0-1.32,1.32v.3a1.32,1.32,0,0,1-.4.95l-1,.23-3.49-7.27a5.24,5.24,0,0,0-4.68-3.07H43.32a5.24,5.24,0,0,0-4.68,3.07l-3.49,7.27-.72-.23a1.32,1.32,0,0,1-.4-.95v-.3a1.32,1.32,0,0,0-1.32-1.32H29.62a1.32,1.32,0,0,0-1.32,1.32h0a1.32,1.32,0,0,0,.86,1.24l4,1.49.8.35A4.48,4.48,0,0,0,32.95,61v5.7a1.83,1.83,0,0,0,1.83,1.83H67.63a1.83,1.83,0,0,0,1.83-1.83V61a4.47,4.47,0,0,0-.92-2.72Z"
      />
      <line style={cls2} x1="38.4" y1="57.29" x2="64.27" y2="57.29" />
      <path
        style={cls3}
        d="M66.32,25v2.19a1.21,1.21,0,0,1-1.21,1.21H37.56a1.21,1.21,0,0,1-1.21-1.21V25"
      />
      <line style={cls2} x1="38.07" y1="28.91" x2="38.07" y2="31.81" />
      <line style={cls4} x1="38.07" y1="34.25" x2="38.07" y2="39.54" />
      <line style={cls2} x1="38.07" y1="40.76" x2="38.07" y2="43.66" />
      <line style={cls2} x1="64.6" y1="28.91" x2="64.6" y2="31.81" />
      <line style={cls4} x1="64.6" y1="34.25" x2="64.6" y2="39.54" />
      <line style={cls2} x1="64.6" y1="40.76" x2="64.6" y2="43.66" />
      <line style={cls2} x1="41.39" y1="29.07" x2="41.39" y2="31.97" />
      <line style={cls5} x1="41.39" y1="33.78" x2="41.39" y2="37.69" />
      <line style={cls2} x1="41.39" y1="38.59" x2="41.39" y2="41.49" />
      <line style={cls2} x1="61.29" y1="28.91" x2="61.29" y2="31.82" />
      <line style={cls5} x1="61.29" y1="33.62" x2="61.29" y2="37.53" />
      <line style={cls2} x1="61.29" y1="38.44" x2="61.29" y2="41.34" />
      <line style={cls2} x1="57.97" y1="28.84" x2="57.97" y2="31.74" />
      <line style={cls6} x1="57.97" y1="33.86" x2="57.97" y2="38.46" />
      <line style={cls2} x1="57.97" y1="39.52" x2="57.97" y2="42.42" />
      <line style={cls2} x1="54.65" y1="29.07" x2="54.65" y2="31.97" />
      <line style={cls5} x1="54.65" y1="33.78" x2="54.65" y2="37.69" />
      <line style={cls2} x1="54.65" y1="38.59" x2="54.65" y2="41.49" />
      <line style={cls2} x1="51.34" y1="28.84" x2="51.34" y2="31.74" />
      <line style={cls6} x1="51.34" y1="33.86" x2="51.34" y2="38.46" />
      <line style={cls2} x1="51.34" y1="39.52" x2="51.34" y2="42.42" />
      <line style={cls2} x1="44.7" y1="28.68" x2="44.7" y2="31.58" />
      <line style={cls6} x1="44.7" y1="33.71" x2="44.7" y2="38.31" />
      <line style={cls2} x1="44.7" y1="39.37" x2="44.7" y2="42.27" />
      <line style={cls2} x1="48.02" y1="28.68" x2="48.02" y2="31.58" />
      <line style={cls5} x1="48.02" y1="33.39" x2="48.02" y2="37.3" />
      <line style={cls2} x1="48.02" y1="38.21" x2="48.02" y2="41.11" />
      <path
        style={cls1}
        d="M20.84,72.94V30.25a5.58,5.58,0,0,1,5.58-5.58H76.24a5.58,5.58,0,0,1,5.58,5.58V72.94"
      />
      <line style={cls3} x1="25.78" y1="71.43" x2="15.9" y2="71.43" />
      <line style={cls3} x1="25.78" y1="68.02" x2="15.9" y2="68.02" />
      <line style={cls3} x1="25.78" y1="64.6" x2="15.9" y2="64.6" />
      <line style={cls3} x1="25.78" y1="61.19" x2="15.9" y2="61.19" />
      <line style={cls3} x1="25.78" y1="57.78" x2="15.9" y2="57.78" />
      <line style={cls3} x1="25.78" y1="54.36" x2="15.9" y2="54.36" />
      <line style={cls3} x1="25.78" y1="50.95" x2="15.9" y2="50.95" />
      <line style={cls3} x1="25.78" y1="47.54" x2="15.9" y2="47.54" />
      <line style={cls3} x1="25.78" y1="44.12" x2="15.9" y2="44.12" />
      <line style={cls3} x1="86.86" y1="71.43" x2="76.98" y2="71.43" />
      <line style={cls3} x1="86.86" y1="68.02" x2="76.98" y2="68.02" />
      <line style={cls3} x1="86.86" y1="64.6" x2="76.98" y2="64.6" />
      <line style={cls3} x1="86.86" y1="61.19" x2="76.98" y2="61.19" />
      <line style={cls3} x1="86.86" y1="57.78" x2="76.98" y2="57.78" />
      <line style={cls3} x1="86.86" y1="54.36" x2="76.98" y2="54.36" />
      <line style={cls3} x1="86.86" y1="50.95" x2="76.98" y2="50.95" />
      <line style={cls3} x1="86.86" y1="47.54" x2="76.98" y2="47.54" />
      <line style={cls3} x1="86.86" y1="44.12" x2="76.98" y2="44.12" />
    </g>
  </svg>
)

export default CarWashIcon
