import { useMemo } from 'react';

export const useGestionAcciones = (derivacion) => {
    const acciones = useMemo(() => {
        const initialState = {
            puedeRecibir: false,
            puedePostergar: false,
            puedeVisar: false,
            puedeFirmar: false,
            esDerivada: false,
            esFinalizada: false,
            esPostergada: false,
            idDerivacion: null,
        };

        if (!derivacion) {
            return initialState;
        }

        const { recepcionada, estadoDerivacion, tipoMovimiento, id } = derivacion;

        const puedeRecibir = !recepcionada;

        const puedePostergar =
            recepcionada &&
            estadoDerivacion !== 'DERIVADA' &&
            estadoDerivacion !== 'FINALIZADA' &&
            estadoDerivacion !== 'POSTERGADA';

        const puedeVisar =
            recepcionada &&
            tipoMovimiento === 'VISACION' &&
            estadoDerivacion === 'PENDIENTE';

        const puedeFirmar =
            recepcionada &&
            tipoMovimiento === 'FIRMA' &&
            estadoDerivacion === 'PENDIENTE';
        
        const esDerivada = recepcionada && estadoDerivacion === 'DERIVADA';
        const esFinalizada = recepcionada && estadoDerivacion === 'FINALIZADA';
        const esPostergada = recepcionada && estadoDerivacion === 'POSTERGADA';

        return {
            puedeRecibir,
            puedePostergar,
            puedeVisar,
            puedeFirmar,
            esDerivada,
            esFinalizada,
            esPostergada,
            idDerivacion: id,
        };
    }, [derivacion]);

    return acciones;
};