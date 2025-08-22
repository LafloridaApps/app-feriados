export const mockDecretosGenerados = [
  {
    id: 101, // Corresponds to the original approval ID
    decretoId: 'DEC-2025-001',
    fechaDecreto: '15-08-2025',
    rut: '11.222.333-4',
    nombre: 'ANA GOMEZ',
    departamento: 'DIRECCIÓN DE ADMINISTRACIÓN Y FINANZAS',
    fechaDesde: '01-09-2025',
    fechaHasta: '05-09-2025',
    jornada: 'Completa',
    duracion: 5,
    fechaSolicitud: '01-08-2025',
    tipoSolicitud: 'Feriado Legal',
    contrato: 'Planta',
    documento: 'documento_101.pdf'
  },
  {
    id: 102,
    decretoId: 'DEC-2025-002',
    fechaDecreto: '16-08-2025',
    rut: '22.333.444-5',
    nombre: 'LUIS FERNANDEZ',
    departamento: 'SECRETARÍA COMUNAL DE PLANIFICACIÓN',
    fechaDesde: '20-08-2025',
    fechaHasta: '20-08-2025',
    jornada: 'Completa',
    duracion: 1,
    fechaSolicitud: '10-08-2025',
    tipoSolicitud: 'Permiso Administrativo',
    contrato: 'Contrata',
    documento: null
  },
  {
    id: 103,
    decretoId: 'DEC-2025-002', // Same decree can have multiple people
    fechaDecreto: '16-08-2025',
    rut: '14.555.666-7',
    nombre: 'CARLA RUIZ',
    departamento: 'DIRECCIÓN DE DESARROLLO COMUNITARIO',
    fechaDesde: '25-08-2025',
    fechaHasta: '26-08-2025',
    jornada: 'Mañana',
    duracion: 2,
    fechaSolicitud: '11-08-2025',
    tipoSolicitud: 'Permiso Administrativo',
    contrato: 'Contrata',
    documento: 'documento_103.pdf'
  },
];
