
"use client";

import React from "react";
import InteractiveDocsPage from "../../Components/InteractiveDocsPage/page"; 
import { useParams } from "next/navigation";

const LanguageDocsPage: React.FC = () => {
  const params = useParams();
  const languageParam = params?.language || "Java";

  return <InteractiveDocsPage currentLanguage={languageParam} />;
};

export default LanguageDocsPage;





























