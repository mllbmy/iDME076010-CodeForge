import React, { useId } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 44, className }) => {
  const id = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-chrome1`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="15%" stopColor="#c0c0c0" />
          <stop offset="30%" stopColor="#e8e8e8" />
          <stop offset="45%" stopColor="#a0a0a0" />
          <stop offset="60%" stopColor="#d5d5d5" />
          <stop offset="75%" stopColor="#909090" />
          <stop offset="90%" stopColor="#e0e0e0" />
          <stop offset="100%" stopColor="#b0b0b0" />
        </linearGradient>
        <linearGradient id={`${id}-chrome2`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#d0d0d0" />
          <stop offset="40%" stopColor="#f0f0f0" />
          <stop offset="60%" stopColor="#b8b8b8" />
          <stop offset="80%" stopColor="#e5e5e5" />
          <stop offset="100%" stopColor="#a8a8a8" />
        </linearGradient>
        <linearGradient id={`${id}-innerRing`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#78909c" />
          <stop offset="25%" stopColor="#546e7a" />
          <stop offset="50%" stopColor="#607d8b" />
          <stop offset="75%" stopColor="#455a64" />
          <stop offset="100%" stopColor="#37474f" />
        </linearGradient>
        <radialGradient id={`${id}-coreBlue`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4fc3f7" />
          <stop offset="30%" stopColor="#29b6f6" />
          <stop offset="60%" stopColor="#039be5" />
          <stop offset="85%" stopColor="#0277bd" />
          <stop offset="100%" stopColor="#01579b" />
        </radialGradient>
        <radialGradient id={`${id}-coreGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#81d4fa" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#4fc3f7" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#0288d1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#01579b" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id={`${id}-bolt`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c0c0c0" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="58" fill={`url(#${id}-chrome1)`} stroke="#909090" strokeWidth="1" />
      <circle cx="60" cy="60" r="55" fill="none" stroke={`url(#${id}-chrome2)`} strokeWidth="2" />
      <circle cx="60" cy="60" r="50" fill={`url(#${id}-innerRing)`} stroke="#455a64" strokeWidth="1" />

      <g fill="#37474f">
        <circle cx="60" cy="14" r="5" />
        <circle cx="60" cy="106" r="5" />
        <circle cx="14" cy="60" r="5" />
        <circle cx="106" cy="60" r="5" />
        <circle cx="27.5" cy="27.5" r="4" />
        <circle cx="92.5" cy="27.5" r="4" />
        <circle cx="27.5" cy="92.5" r="4" />
        <circle cx="92.5" cy="92.5" r="4" />
      </g>

      <g fill={`url(#${id}-bolt)`}>
        <ellipse cx="60" cy="14" rx="3" ry="5" />
        <ellipse cx="60" cy="106" rx="3" ry="5" />
        <ellipse cx="14" cy="60" rx="5" ry="3" />
        <ellipse cx="106" cy="60" rx="5" ry="3" />
        <ellipse cx="27.5" cy="27.5" rx="3.5" ry="3.5" transform="rotate(45 27.5 27.5)" />
        <ellipse cx="92.5" cy="27.5" rx="3.5" ry="3.5" transform="rotate(45 92.5 27.5)" />
        <ellipse cx="27.5" cy="92.5" rx="3.5" ry="3.5" transform="rotate(45 27.5 92.5)" />
        <ellipse cx="92.5" cy="92.5" rx="3.5" ry="3.5" transform="rotate(45 92.5 92.5)" />
      </g>

      <circle cx="60" cy="60" r="32" fill={`url(#${id}-chrome1)`} stroke="#78909c" strokeWidth="1" />
      <circle cx="60" cy="60" r="28" fill={`url(#${id}-innerRing)`} stroke="#455a64" strokeWidth="1" />
      <circle cx="60" cy="60" r="22" fill={`url(#${id}-coreBlue)`} />
      <circle cx="60" cy="60" r="18" fill={`url(#${id}-coreGlow)`} />
      <circle cx="60" cy="60" r="12" fill="#01579b" stroke="#0277bd" strokeWidth="1" />
      <circle cx="60" cy="60" r="6" fill="#0288d1" />
      <circle cx="60" cy="60" r="3" fill="#81d4fa" />

      <g fill="#ffffff" opacity="0.9">
        <circle cx="54" cy="54" r="2" />
        <circle cx="66" cy="54" r="2" />
        <circle cx="54" cy="66" r="2" />
        <circle cx="66" cy="66" r="2" />
        <circle cx="60" cy="48" r="1.5" />
        <circle cx="60" cy="72" r="1.5" />
        <circle cx="48" cy="60" r="1.5" />
        <circle cx="72" cy="60" r="1.5" />
      </g>

      <circle cx="60" cy="60" r="58" fill="none" stroke="#4fc3f7" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
};

export default Logo;
