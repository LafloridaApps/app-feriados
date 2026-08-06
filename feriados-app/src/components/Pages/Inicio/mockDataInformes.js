export const mockDataInformes = {
    kpis: {
        totalAnual: 1450,
        aprobadas: 1120,
        pendientes: 85,
        rechazadas: 245
    },
    porDepartamento: [
        { depto: 'Dirección de Salud', cantidad: 450, color: 'bg-primary' },
        { depto: 'Educación Municipal', cantidad: 380, color: 'bg-info' },
        { depto: 'Obras Municipales', cantidad: 210, color: 'bg-success' },
        { depto: 'Tránsito y Transporte', cantidad: 150, color: 'bg-warning' },
        { depto: 'DIDECO', cantidad: 170, color: 'bg-danger' },
        { depto: 'Alcaldía', cantidad: 90, color: 'bg-secondary' },
    ],
    porMes: [
        { mes: 'Ene', cantidad: 120 },
        { mes: 'Feb', cantidad: 180 },
        { mes: 'Mar', cantidad: 90 },
        { mes: 'Abr', cantidad: 110 },
        { mes: 'May', cantidad: 140 },
        { mes: 'Jun', cantidad: 130 },
        { mes: 'Jul', cantidad: 210 },
        { mes: 'Ago', cantidad: 100 },
        { mes: 'Sep', cantidad: 160 },
        { mes: 'Oct', cantidad: 80 },
        { mes: 'Nov', cantidad: 50 },
        { mes: 'Dic', cantidad: 60 },
    ],
    tiposPermiso: [
        { tipo: 'Feriado Legal', porcentaje: 65 },
        { tipo: 'Día Administrativo', porcentaje: 25 },
        { tipo: 'Permiso Especial', porcentaje: 10 },
    ],
    departamentosDropdown: [
        'Todos', 'Dirección de Salud', 'Educación Municipal', 'Obras Municipales', 'Tránsito y Transporte', 'DIDECO', 'Alcaldía'
    ]
};