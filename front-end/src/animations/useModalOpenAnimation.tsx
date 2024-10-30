import { useSpring } from '@react-spring/web';

export const useModalOpenAnimation = (isOpen: boolean) => {
  return useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
  });
};