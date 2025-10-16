import { FirmaDigitalContext } from './FirmaDigitalContext';
import { useFirmaDigital } from '../hooks/useFirmaDigital';

export const FirmaDigitalProvider = ({ children }) => {
    const { firma, loading, error, tieneFirma } = useFirmaDigital();

    return (
        <FirmaDigitalContext.Provider value={{ firma, loading, error, tieneFirma }}>
            {children}
        </FirmaDigitalContext.Provider>
    );
};
