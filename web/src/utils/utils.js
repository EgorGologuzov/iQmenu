
export function sleep(miliseconds) {
  return new Promise((resolve, _) => setTimeout(() => resolve(), miliseconds));
}
