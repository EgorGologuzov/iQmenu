import { UAParser } from 'ua-parser-js';

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

export function parseDeviceInfo(userAgentStr) {
  if (!userAgentStr) return null;

  const parser = new UAParser(userAgentStr);
  const info = parser.getResult();

  const result = {
    type: info.device.type, // mobile | tablet | desktop
    browser: info.browser?.name,
    os: [info.os?.name, info.os?.version].filter(Boolean).join(" "),
    device: info.device?.model,
  }

  result.stringInfo = `клиент: ${[result.os, result.browser, result.device].filter(Boolean).join(", ")}`;

  return result;
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

