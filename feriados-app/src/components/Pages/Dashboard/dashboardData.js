// src/components/Pages/Dashboard/dashboardData.js

export const DATOS_AUSENCIA_MOCK = [
    { nombreGrupo: 'Direccion de Administracion', nombre: 'John Doe', rut: '12345678-9', motivo: 'Vacaciones', idSolicitud: 'SOL001', fechaAprobacion: '2025-08-01', periodoAusencia: { fechaInicio: '2025-08-19', fechaFin: '2025-08-25' } },
    { nombreGrupo: 'Direccion de Administracion', nombre: 'Jane Smith', rut: '98765432-1', motivo: 'Enfermedad', idSolicitud: 'SOL002', fechaAprobacion: '2025-08-15', periodoAusencia: { fechaInicio: '2025-08-22', fechaFin: '2025-08-22' } },
    { nombreGrupo: 'Departamento de Recursos Humanos', nombre: 'Peter Jones', rut: '11223344-5', motivo: 'Permiso Administrativo', idSolicitud: 'SOL003', fechaAprobacion: '2025-08-10', periodoAusencia: { fechaInicio: '2025-08-21', fechaFin: '2025-08-23' } },
    { nombreGrupo: 'Direccion de Administracion', nombre: 'Alice', rut: '22334455-6', motivo: 'Vacaciones', idSolicitud: 'SOL004', fechaAprobacion: '2025-08-05', periodoAusencia: { fechaInicio: '2025-08-20', fechaFin: '2025-08-28' } },
    { nombreGrupo: 'Direccion de Obras', nombre: 'Bob', rut: '33445566-7', motivo: 'Enfermedad', idSolicitud: 'SOL005', fechaAprobacion: '2025-08-18', periodoAusencia: { fechaInicio: '2025-08-23', fechaFin: '2025-08-23' } },
    { nombreGrupo: 'Direccion de Administracion', nombre: 'Charlie', rut: '44556677-8', motivo: 'Permiso Administrativo', idSolicitud: 'SOL006', fechaAprobacion: '2025-08-12', periodoAusencia: { fechaInicio: '2025-08-24', fechaFin: '2025-08-24' } },
    { nombreGrupo: 'Direccion de Finanzas', nombre: 'David', rut: '55667788-9', motivo: 'Vacaciones', idSolicitud: 'SOL007', fechaAprobacion: '2025-08-01', periodoAusencia: { fechaInicio: '2025-08-20', fechaFin: '2025-08-25' } },
    { nombreGrupo: 'Departamento de Aseo', nombre: 'Eve', rut: '66778899-0', motivo: 'Enfermedad', idSolicitud: 'SOL008', fechaAprobacion: '2025-08-19', periodoAusencia: { fechaInicio: '2025-08-24', fechaFin: '2025-08-24' } },
];

export const NIVEL_USUARIO_MOCK = 'Alcaldia'; 
export const DEPARTAMENTO_USUARIO_MOCK = 'Direccion de Administracion'; 

export const DATOS_GRAFICO_MOCK = {
    etiquetas: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    valores: [65, 59, 80, 81, 56, 55, 40],
};
