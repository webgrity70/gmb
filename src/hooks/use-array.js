// https://github.com/zakariaharti/react-hookedup/blob/master/src/hooks/useArray.ts

import { useState, useCallback } from 'react';

const useArray = (initial) => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue,
    add: useCallback((a) => setValue((v) => [...v, a]), []),
    clear: useCallback(() => setValue(() => []), []),
    removeIndex: useCallback(
      (index) =>
        setValue((v) => {
          const newArr = [...v];
          newArr.splice(index, 1);
          return newArr;
        }),
      []
    ),
  };
};

export default useArray;
