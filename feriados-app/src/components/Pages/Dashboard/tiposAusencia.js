export const contarAusenciasPorTipo = (datosAusenciasDia) => {
    const conteo = {};
    if (!datosAusenciasDia) return conteo;
    Object.values(datosAusenciasDia.detalles || {}).forEach(empleados => {
        (empleados || []).forEach(empleado => {
            const tipo = (empleado.motivo || 'OTRO').toUpperCase();
            conteo[tipo] = (conteo[tipo] || 0) + 1;
        });
    });
    return conteo;
};

export const claseBadgeDiaPorTipo = (tipo) =>
    (tipo || '').toUpperCase() === 'LICENCIA' ? 'absence-badge absence-badge-licencia' : 'absence-badge';

export const claseBadgeDiaMobilePorTipo = (tipo) =>
    (tipo || '').toUpperCase() === 'LICENCIA' ? 'badge bg-danger rounded-pill mt-1' : 'badge bg-primary rounded-pill mt-1';

export const claseBadgeDetallePorTipo = (tipo) =>
    (tipo || '').toUpperCase() === 'LICENCIA' ? 'badge bg-danger text-white' : 'badge bg-info text-dark';

export const claseBadgeDetalleMobilePorTipo = (tipo) =>
    (tipo || '').toUpperCase() === 'LICENCIA' ? 'badge bg-danger text-white' : 'badge bg-primary bg-opacity-10 text-primary border border-primary-subtle';
