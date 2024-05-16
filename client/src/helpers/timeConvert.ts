export const timeConvert = (ms: number): string => {
    const min = Math.floor((ms / (1000 * 60)) % 60);
    const sec = Math.floor((ms / 1000) % 60);
    const formMin = min < 10 ? `0${min}` : `${min}`;
    const formSec = sec < 10 ? `0${sec}` : `${sec}`;
    return `${formMin}:${formSec}`;
};