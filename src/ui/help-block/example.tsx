import { HelpBlock } from './HelpBlock';

export function Example() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <HelpBlock>We send one curriculum update per week.</HelpBlock>
      <HelpBlock variant='success'>Username available.</HelpBlock>
      <HelpBlock variant='error'>Username already in use.</HelpBlock>
    </div>
  );
}
