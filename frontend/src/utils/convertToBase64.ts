export const convertToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String);
        };

        reader.onerror = reject;

        if (file) {
            reader.readAsDataURL(file);
        } else {
            reject(new Error("No file provided"));
        }
    });
};
