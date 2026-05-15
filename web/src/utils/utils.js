
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

  return { os, browser, type, stringInfo: `клиент: ${[os, browser].filter(Boolean).join(", ")}` };
}

export function formatRelativeTime(targetDate) {
  const now = new Date();
  const past = new Date(targetDate);
  const diffMs = now - past;
  
  // Перевод разницы в разные единицы времени
  const diffMins = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Вспомогательная функция для правильных окончаний русских слов
  const getNoun = (number, one, two, five) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) return five;
    n %= 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return two;
    return five;
  };

  // Условие 1: Меньше 1 минуты
  if (diffMins < 1) {
    return 'только что';
  }
  
  // Условие 2: Меньше 1 часа
  if (diffHours < 1) {
    return `${diffMins} ${getNoun(diffMins, 'минуту', 'минуты', 'минут')} назад`;
  }
  
  // Условие 3: Меньше 1 дня (24 часов)
  if (diffDays < 1) {
    return `${diffHours} ${getNoun(diffHours, 'час', 'часа', 'часов')} назад`;
  }
  
  // Условие 4: Меньше 7 дней
  if (diffDays < 7) {
    return `${diffDays} ${getNoun(diffDays, 'день', 'дня', 'дней')} назад`;
  }
  
  // Условие 5: Больше 7 дней (Формат: день месяцСловом год)
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return formatter.format(past).replace(' г.', '');
}

export function formatTime(date) {
  date = new Date(date);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

