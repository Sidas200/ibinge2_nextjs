// components/PlatformLogos.js
import styles from './PlatformLogos.module.css';

export default function PlatformLogos({ platforms }) {
  return (
    <div className={styles.logos}>
      {platforms?.name && <img src={`/logos/${platforms.name}.png`} alt={`${platforms.name} logo`} />}
    </div>
  );
}
