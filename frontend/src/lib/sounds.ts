export const playCoinSound = () => {
  if (typeof window !== 'undefined') {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1992/1992-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
  }
};

export const playSwooshSound = () => {
  if (typeof window !== 'undefined') {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));
  }
};
