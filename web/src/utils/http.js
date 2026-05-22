
export function handleHttpError(error, options) {

	const initError = (message) => {
		const newError = new Error(message);
		console.error(error);
		return newError;
	}

	if (!error.response) {
		if (!navigator.onLine) {
			return initError("Нет подключения к интернету");
		}
		return initError("Сервер не отвечает. Проверьте подключение к интернету и настройки сети или попробуйте зайти позже.");
	}
	if (error.response.status >= 500) {
		return initError("Внутренняя ошибка сервера. Сообщите о проблеме в тех. поддержку.");
	}

	const anotherMessage = options ? (options[error.response.status] ?? options.another) : undefined
	if (anotherMessage) {
		return initError(anotherMessage);
	}

	const apiMessage = error.response.data?.error;
	if (typeof apiMessage === "string") {
		return initError(apiMessage);
	}

	return initError("Произошла неизвестная ошибка. Сообщите о проблеме в тех. поддержку.");
}
