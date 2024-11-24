import React, { createContext, useState, useContext } from 'react';

interface TemplateContextType {
  formTemplateId: string | null;
  setFormTemplateId: (id: string | null) => void;
}

const TemplateContext = createContext<TemplateContextType>({
  formTemplateId: null,
  setFormTemplateId: () => {},
});

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formTemplateId, setFormTemplateId] = useState<string | null>(null);

  return (
    <TemplateContext.Provider value={{ formTemplateId, setFormTemplateId }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => useContext(TemplateContext);