import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import i18n from "@/i18n";

const LanguageDetector = () => {
  const { lang } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, navigate]);

  return null;
};

export default LanguageDetector;
