export const uuid = () => {
  const now = new Date();
  return `${now.getTime()}-${Math.floor(Math.random() * 1000)}`;
};
