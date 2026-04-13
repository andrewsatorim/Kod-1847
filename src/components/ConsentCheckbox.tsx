"use client";
import { useState } from "react";
import Link from "next/link";

interface Props {
  onConsentChange: (checked: boolean) => void;
}

export default function ConsentCheckbox({ onConsentChange }: Props) {
  const [checked, setChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = () => {
    const next = !checked;
    setChecked(next);
    onConsentChange(next);
    if (next) setShowError(false);
  };

  return (
    <div className="consent-block">
      <label className="consent-label">
        <input
          type="checkbox"
          name="consent"
          className="consent-checkbox"
          checked={checked}
          onChange={handleChange}
          required
        />
        <span className="consent-checkmark" />
        <span className="consent-text">
          Я даю согласие на обработку персональных данных в соответствии
          с{" "}
          <Link href="/privacy" target="_blank" className="consent-link">
            Политикой конфиденциальности
          </Link>
        </span>
      </label>
      {showError && (
        <p className="consent-error">
          Для отправки заявки необходимо дать согласие на обработку персональных
          данных
        </p>
      )}
    </div>
  );
}

export function useConsent() {
  const [consented, setConsented] = useState(false);
  const [showError, setShowError] = useState(false);

  const validateConsent = (): boolean => {
    if (!consented) {
      setShowError(true);
      return false;
    }
    return true;
  };

  return { consented, setConsented, showError, setShowError, validateConsent };
}
