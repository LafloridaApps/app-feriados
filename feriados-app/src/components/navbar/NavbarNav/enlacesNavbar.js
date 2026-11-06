export const enlacesNavbar = [
    {
        "ruta": "/home",
        "titulo": "Inicio",
        "icono": "bi-house"
    },
    {
        "ruta": "/calendario",
        "titulo": "Calendario de Ausencias",
        "icono": "bi-calendar3",
        "permiso": "CALENDARIO AUSENCIAS"
    },
    {
        "ruta": "/mis-solicitudes",
        "titulo": "Mis Solicitudes",
        "icono": "bi-file-earmark-text"
    },
    {
        "ruta": "/solicitudes",
        "titulo": "Nueva Solicitud",
        "icono": "bi-file-earmark-plus"
    },
    {
        "id": "infoAusencias",
        "titulo": "Información Ausencias",
        "icono": "bi-info-circle",
        "enlaces": [
            {
                "ruta": "/feriados",
                "titulo": "Feriados Legales",
                "icono": "bi-calendar-check"
            },
            {
                "ruta": "/administrativos",
                "titulo": "Administrativos",
                "icono": "bi-briefcase"
            }
        ]
    },
    {
        "ruta": "/inbox",
        "titulo": "Bandeja de Solicitudes",
        "icono": "bi-inbox",
        "soloJefe": true
    },
    {
        "id": "rrhh",
        "titulo": "RRHH",
        "icono": "bi-people",
        "enlaces": [
            {
                "ruta": "/rrhh",
                "titulo": "Generador Decretos",
                "icono": "bi-file-earmark-text"
            },
            {
                "ruta": "/rrhh/subrogancia",
                "titulo": "Ingreso Subrogancia",
                "icono": "bi-person-plus"
            },
            {
                "ruta": "/administracion/adm-solicitudes",
                "titulo": "Visor de Solicitudes",
                "icono": "bi-pen"
            }
        ],
        "permiso": "RRHH"
    },
    {
        "id": "parametros",
        "titulo": "Parámetros",
        "icono": "bi-gear",
        "enlaces": [
            {
                "ruta": "/deptos",
                "titulo": "Departamentos",
                "icono": "bi-diagram-3"
            },
            {
                "ruta": "/parametros/documentos",
                "titulo": "Gestión de Documentos",
                "icono": "bi-file-text"
            }
        ],
        "permiso": "PARAMETROS"
    },
    {
        "id": "administracion",
        "titulo": "Administración",
        "icono": "bi-person-rolodex",
        "enlaces": [
            {
                "ruta": "/administracion/usuarios",
                "titulo": "Usuarios",
                "icono": "bi-person"
            },
            {
                "ruta": "/administracion/modulos",
                "titulo": "Módulos",
                "icono": "bi-grid"
            }
        ],
        "permiso": "ADMINISTRACION"
    }
];
