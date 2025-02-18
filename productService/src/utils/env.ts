
export const getStringEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key]

    if (value) {
        return value;
    }

    console.warn(`Environment variable ${key} is not set, using default value: ${defaultValue}`);

    return defaultValue || '';
}

export const getNumberEnv = (key: string, defaultValue?: number): Number => {
    const value = process.env[key]

    if (value) {
        const parsedValue = Number(value);

        if (!isNaN(parsedValue)) {
            return parsedValue;
        }

        console.warn(`Environment variable ${key} is not a number, using default value: ${defaultValue}`);
    } else {
        console.warn(`Environment variable ${key} is not set, using default value: ${defaultValue}`);
    }

    return defaultValue ?? 0;
}