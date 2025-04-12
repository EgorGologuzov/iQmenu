
export function sleep(miliseconds) {
  return new Promise((resolve, _) => setTimeout(() => resolve(), miliseconds));
}

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function arraysIntersection(arr1, arr2) {
  if (!arr1 || !arr1.length || !arr2 || !arr2.length) {
    return [];
  }

  return arr1.filter(item => arr2.includes(item));
}

export function fileToDataUrl(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
