import useNeomeStore from './useNeomeStore';
import { clamp } from './applyEvent';

import carrotGrey from './assets/carrots/carrot-grey.svg';
import carrotIcon from './assets/carrots/carrot.svg';
import carrotNegative from './assets/carrots/carrot-negative.svg';

export default function CarrotCounter() {
  const dailyCarrots = useNeomeStore(s => s.getState().dailyCarrots);

  return [...Array(10).keys()].map(n => {
    // Fraction of this slot that should be filled (0 … 1)
    const fillFraction = clamp((dailyCarrots >= 0 ? 0 : 10) + dailyCarrots - n, 0, 1);
    // Convert to a CSS percentage for the clip‑path
    const clipPercent = `${(1 - fillFraction) * 100}%`;
    carrotNegative;

    return (
      <div key={n} className="flex-1 relative carrot-wrapper">
        {/* Grey carrot – always shown */}
        <img src={carrotGrey} alt="" className="carrot-grey" />

        {/* Coloured carrot – clipped to the exact fraction */}
        <img
          src={dailyCarrots > 0 ? carrotIcon : carrotNegative}
          alt=""
          className="carrot-fill"
          style={{ clipPath: `inset(0 ${clipPercent} 0 0)` }}
        />
      </div>
    );
  });
}
