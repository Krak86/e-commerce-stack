export const verbose = (callback: () => void, show = false): void => {
  if (show) callback();
  return void 0;
};
