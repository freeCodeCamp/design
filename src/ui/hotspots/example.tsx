import { Hotspots, type HotspotItem } from './Hotspots';
import { RectHotspot, EllipseHotspot } from '../hotspot-shapes/HotspotShapes';

const Diagram = () => (
  <svg viewBox='0 0 200 140' role='img' aria-label='Three shapes'>
    <rect x='33' y='25' width='29' height='92' fill='currentColor' />
    <ellipse cx='100' cy='75' rx='30' ry='45' fill='currentColor' />
    <rect x='138' y='25' width='29' height='92' fill='currentColor' />
  </svg>
);

const HOTSPOTS: HotspotItem[] = [
  {
    id: 'bracket-left',
    label: 'Opening Paren',
    shape: <RectHotspot x={33} y={25} width={29} height={92} />
  },
  {
    id: 'fire',
    label: 'Ellipse',
    shape: <EllipseHotspot cx={100} cy={75} rx={30} ry={45} />
  },
  {
    id: 'bracket-right',
    label: 'Closing Paren',
    shape: <RectHotspot x={138} y={25} width={29} height={92} />
  }
];

export function HotspotsDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 360, margin: '0 auto' }}>
      <Hotspots
        background={<Diagram />}
        width={200}
        height={140}
        hotspots={HOTSPOTS}
        targetId='fire'
        prompt='Click the ellipse'
        onCorrect={id => console.log('correct', id)}
      />
    </div>
  );
}
