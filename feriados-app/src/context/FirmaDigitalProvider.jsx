import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FirmaDigitalContext } from './FirmaDigitalContext';
import { useFirmaDigital } from '../hooks/useFirmaDigital';

export const FirmaDigitalProvider = ({ children }) => {
    const { firma, loading, error, tieneFirma } = useFirmaDigital();

    const value = useMemo(
        () => ({ firma, loading, error, tieneFirma }),
        [firma, loading, error, tieneFirma]
    );

    return (
        <FirmaDigitalContext.Provider value={value}>
            {children}
        </FirmaDigitalContext.Provider>
    );
};

FirmaDigitalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
