import { atom } from 'recoil';

export const todoState = atom({
  key: 'todoState',
  default: [],
});

export const refetchState = atom({
  key: 'refetchState',
  default: 0,
});
