import { useMemo } from 'react';

const parseSafeDate = (dateStr) => {
    if (!dateStr) return 0;
    const [datePart] = dateStr.split('T');
    const parts = datePart.split(/[-/]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) {
            return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
        } else if (parts[2].length === 4) {
            return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
        }
    }
    return new Date(dateStr).getTime();
};

const getEstado = (s) => (s.estadoSolicitud || '').trim().toUpperCase();

const MS_MARGINA = 3 * 24 * 60 * 60 * 1000;

export const useTraslapes = (sortedItems) => {
    return useMemo(() => {
        const overlaps = [];
        const checked = new Set();

        const validas = sortedItems.filter(s => {
            const estado = getEstado(s);
            return estado !== 'ANULADA' && estado !== 'RECHAZADA' && estado !== 'POSTERGADA';
        });

        const pendientes = validas.filter(s => {
            const estado = getEstado(s);
            return !['FINALIZADA', 'APROBADA', 'DECRETADA', 'FIRMADA', 'TRAMITADA'].includes(estado);
        });

        pendientes.forEach(sol => {
            if (checked.has(sol.id)) return;
            if (!sol.fechaInicio) return;

            const start1 = parseSafeDate(sol.fechaInicio);
            const end1 = parseSafeDate(sol.fechaFin || sol.fechaTermino || sol.fechaInicio);
            const depto1Name = sol.nombreDepartamento || 'Desconocido';
            const depto1Key = depto1Name.trim().toLowerCase();

            if (!start1 || !end1) return;

            const group = [sol];

            validas.forEach(other => {
                if (sol.id === other.id) return;
                if (!other.fechaInicio) return;

                const start2 = parseSafeDate(other.fechaInicio);
                const end2 = parseSafeDate(other.fechaFin || other.fechaTermino || other.fechaInicio);
                const depto2Key = (other.nombreDepartamento || 'Desconocido').trim().toLowerCase();

                if (!start2 || !end2) return;

                if (depto1Key === depto2Key && start1 <= (end2 + MS_MARGINA) && start2 <= (end1 + MS_MARGINA)) {
                    group.push(other);
                }
            });

            if (group.length > 1) {
                const uniqueGroup = Array.from(new Map(group.map(item => [item.id, item])).values());
                uniqueGroup.forEach(item => checked.add(item.id));

                overlaps.push({
                    id: sol.id,
                    departamento: depto1Name,
                    solicitudes: uniqueGroup
                });
            }
        });

        return overlaps;
    }, [sortedItems]);
};
