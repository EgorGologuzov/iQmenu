
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
  return new URL(url, process.env.REACT_APP_API_BASE_URL).toString();
}

export function getUserAgent() {
  try {
    return navigator.userAgent;
  } catch {
    return undefined;
  }
}

export function parseDeviceInfo(userAgentString) {
  if (!userAgentString) return null;

  let os = null;
  let browser = null;
  let type = null;
  let ua = userAgentString;

  if (ua) {
    // Определение ОС
    if (ua.indexOf("Win") !== -1) os = "Windows";
    if (ua.indexOf("Mac") !== -1) os = "macOS";
    if (ua.indexOf("Linux") !== -1) os = "Linux";
    if (ua.indexOf("Android") !== -1) os = "Android";
    if (ua.indexOf("like Mac") !== -1) os = "iOS";

    // Определение браузера
    if (ua.indexOf("Firefox") !== -1) browser = "Mozilla Firefox";
    else if (ua.indexOf("SamsungBrowser") !== -1) browser = "Samsung Browser";
    else if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) browser = "Opera";
    else if (ua.indexOf("Trident") !== -1) browser = "Internet Explorer";
    else if (ua.indexOf("Edge") !== -1 || ua.indexOf("Edg") !== -1) browser = "Microsoft Edge";
    else if (ua.indexOf("Chrome") !== -1) browser = "Google Chrome";
    else if (ua.indexOf("Safari") !== -1) browser = "Safari";

    // Определение типа устройства (простой метод по ключевым словам и тач-способностям)
    const isMobile = /Mobile|Android|iPhone|iPad|IEMobile|BlackBerry|Kindle/i.test(ua);
    type = isMobile ? "modile" : "desktop";
  }

  return { os, browser, type }
}
