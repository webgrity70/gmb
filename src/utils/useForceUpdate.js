import { useState } from 'react';

export default () => {
  const [value, set] = useState(true);
  return () => set(!value);
};
