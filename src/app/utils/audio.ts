export const playAudio = function(volume: number) {
    const audio = document.querySelector("audio") as HTMLAudioElement;
    audio.volume = volume ?? 0.7;
}; 

export const audioSettings = function(volume:number) {
    playAudio(volume);
};