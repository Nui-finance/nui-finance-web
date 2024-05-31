import { useDisclosure } from '@chakra-ui/react';
import ResultModal from 'components/organism/result-modal';
import { createContext, useContext } from 'react';

export const ErrorPopupContext = createContext({
  errorPopup: () => {},
});

export const useErrorPopup = () => useContext(ErrorPopupContext);

export const ErrorPopupProvider = ({ children }) => {
  const errorDisclosure = useDisclosure();
  return (
    <ErrorPopupContext.Provider value={{ errorPopup: errorDisclosure.onOpen }}>
      {children}
      <ResultModal
        type="ERROR"
        {...errorDisclosure}
        onClose={() => {
          errorDisclosure.onClose();
        }}
      />
    </ErrorPopupContext.Provider>
  );
};
