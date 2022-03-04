export const types = [
  {
    name: 'Organization',
    description: 'Create a group for your Gym, School or Company.',
    value: 'organization',
    link: {
      label: 'Own or manage this business?',
      url: 'https://forms.gle/Zc54Y7S4a8QW5VDF6',
    },
  },
  {
    name: 'Personal',
    description:
      'Create a group for old or new friends. It can be for anything. Things you want to achieve, things you like... your imagination is the only limit.',
    value: 'personal',
  },
];

export const privacy = [
  {
    name: 'Public Group',
    description: 'Anyone can join without requesting access.',
    value: 'Public',
    icon: 'circle notch',
  },
  {
    name: 'Private Group',
    description:
      'Users must request access and be accepted by an Administrator in order to join.',
    value: 'Private',
    icon: 'circle outline',
  },
];
