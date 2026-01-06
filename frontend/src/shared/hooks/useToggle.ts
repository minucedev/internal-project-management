import { useState, useCallback } from 'react';

export const useToggle = (initialState: boolean = false): [boolean, () => void, (value: boolean) => void] => {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  const setToggle = useCallback((value: boolean) => {
    setState(value);
  }, []);

  return [state, toggle, setToggle];
};
