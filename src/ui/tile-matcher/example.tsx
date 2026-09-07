import { TileMatcher, type TileMatcherPair } from './TileMatcher';

const pairs: TileMatcherPair[] = [
  { id: 'html', faces: ['HTML', 'Structure'] },
  { id: 'css', faces: ['CSS', 'Style'] },
  { id: 'js', faces: ['JS', 'Behavior'] }
];

export function Drill() {
  return (
    <TileMatcher
      pairs={pairs}
      columns={3}
      seed={1}
      onMatch={id => console.log('matched', id)}
      onComplete={({ moves }) => console.log('done in', moves, 'moves')}
    />
  );
}
