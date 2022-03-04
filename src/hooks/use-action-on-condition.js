import { useEffect } from 'react';

export default function useActionOnCondition(action, condition) {
  useEffect(() => {
    if (condition) {
      action();
    }
  }, [action, condition]);
}
