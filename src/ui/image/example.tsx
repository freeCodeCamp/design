import { Image } from './Image';

export function Example() {
  return (
    <Image
      style={{ background: '#f5f6f7', padding: 16 }}
      src='/brand/fcc-secondary.svg'
      alt='freeCodeCamp mark'
      caption='freeCodeCamp mark'
    />
  );
}
