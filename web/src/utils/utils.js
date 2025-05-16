import { API_BASE_URL } from "../values/consts";

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

export function asInSentense(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function logAndReturnError(message) {
  const error = new Error(message);
  console.error(error);
  return error;
}

export function joinWithApiBaseUrl(url) {
  if (!url) return;
  return new URL(url, API_BASE_URL).toString();
}
