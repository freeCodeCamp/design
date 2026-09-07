import { DescriptionList } from './DescriptionList';

export function Example() {
  return (
    <DescriptionList
      items={[
        { term: 'Username', detail: 'camper-42' },
        { term: 'Joined', detail: '2014-04-12' },
        { term: 'Certifications', detail: '3 of 14' }
      ]}
    />
  );
}
