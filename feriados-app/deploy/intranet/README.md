# Intranet: publicación incremental de commits y main local

Destino exclusivo: `desarrollo@192.168.10.49`, host `Srv-Intranet`.
No se ejecutan `fetch`, `pull` ni `push`: las sincronizaciones las hace el usuario.
No se guardan contraseñas. Desarrollo local conserva su flujo separado.

## Preparar y publicar

Desde `/home/mirko/Documentos/Fuentes/app-feriados/feriados-app`:

```bash
# Ver Git local, sin conectar, escribir ni fusionar:
./subir-intranet.sh --dry-run

# Revisar entorno remoto, sin cambios:
./subir-intranet.sh --check

# Comparar los commits de trabajo con las imágenes realmente activas:
./subir-intranet.sh --plan

# Con todos los cambios ya confirmados:
./subir-intranet.sh

# Confirmar explícitamente los cambios pendientes y publicar:
./subir-intranet.sh --commit-message "fix: postergacion firmada y flujo de publicacion"

# Versión explícita opcional:
./subir-intranet.sh intranet-20261116-postergacion01

# Solo construir/probar los componentes nuevos, sin desplegar ni mover main:
./subir-intranet.sh --build-only
```

La opción `--commit-message` autoriza confirmar los cambios pendientes de cada
repositorio, incluidos los archivos nuevos no ignorados. Revisa antes `git diff`
y `git status`. Se rechazan archivos de credenciales y configuraciones con claves
literales. Sin esa opción, cualquier cambio pendiente detiene la publicación.
No se publica código sin commit. Si los cambios estaban sobre `main`, esa opción
crea una rama `codex/preparar-<version>` antes del commit para no adelantar main.
Los commits de preparación se conservan aunque la publicación falle.

## Qué se omite

Cada imagen activa se identifica por su ID y la etiqueta OCI
`org.opencontainers.image.revision`. Las imágenes anteriores sin esa etiqueta
solo se reconocen mediante su tag Git disponible localmente; si no hay una
procedencia verificable, se detiene el proceso. No se hace una sincronización
Git automática para resolverlo.

Se prepara la integración de `main` con la rama de trabajo en un worktree aislado.
La fusión puede avanzar directamente si la historia lo permite; cuando hay ramas
divergentes, crea un commit de merge. Los conflictos detienen la preparación sin
cambiar main ni el directorio de trabajo original.

Si el commit integrado ya está incluido en el commit activo, el proyecto muestra
`OMITIR`: no se transfiere su paquete, no se construye su imagen ni se reinicia su
servicio. Si hay commits nuevos, muestra `PUBLICAR`. Una propuesta que no contenga
el commit activo se rechaza para evitar una regresión accidental. Los proyectos
omitidos mantienen su imagen y versión actuales; una entrega puede reunir varias
etiquetas de imagen. No se fuerza una etiqueta nueva para componentes idénticos.

Por ejemplo, SMC activo `6b55beba` y rama integrada `6b55beba` implica omitir SMC.
Si solo cambian solicitudes y feriados, únicamente se transfieren, construyen y
reemplazan esos dos componentes. Se prueba la compatibilidad del conjunto usando
las imágenes existentes para los componentes omitidos.

Si todos están al día, no se crea ninguna publicación remota. Se vuelve a comprobar
que sus IDs no cambiaron y se alinea main local con los commits ya activos.

## Cuándo cambia main

Los candidatos se construyen desde el árbol del commit integrado, no desde archivos
sin confirmar. Se conservan referencias locales `refs/deployments/intranet/<version>`.
`main` no cambia durante la construcción ni las pruebas. Solo se promueve después
de que el servidor haya verificado imágenes, disponibilidad, contratos de API y
rutas públicas. La rama de trabajo original permanece seleccionada.

La promoción comprueba que nadie movió main durante la publicación y no descarta
cambios pendientes de un worktree que tenga main abierto. Si falla la promoción,
se intenta recuperar las ramas ya promovidas y se solicita la reversión remota.
Ante un fallo de recuperación se requiere revisar el recibo y el estado real.
Esta es una coordinación entre equipos, no una transacción distribuida atómica;
una desconexión puede dejar pendiente completar la promoción local.

Cada publicación guarda un recibo privado en el directorio Git común del frontend:
`intranet-publicaciones/<version>.json`. Registra commits de origen, integración,
main anterior, commit activo anterior, IDs de imágenes y servicios seleccionados.
No contiene contraseñas. Las versiones y recibos existentes no se sobrescriben.

## Reversión y conexiones interrumpidas

Para recuperar imágenes **y main local**, ejecutar desde el mismo equipo/repo:

```bash
./subir-intranet.sh --rollback <version>
```

Primero verifica que main no haya cambiado por otro trabajo. Restaura los
contenedores anteriores afectados, comprueba sus IDs y disponibilidad y luego
mueve main al commit que realmente estaba activo antes. No elimina los commits
nuevos: siguen en la rama de trabajo y en las referencias de publicación. No hace
push forzado ni sincroniza remotos. Si main está abierto, conserva coherentes el
índice y sus archivos y rechaza cambios pendientes.

Si se perdió SSH después de activar las imágenes:

```bash
./subir-intranet.sh --recover <version>
```

Solo completa main cuando todos los commits activos son los del recibo y existe
la constancia remota `activated.json` de verificación final. Si siguen activas las
imágenes anteriores, informa que no corresponde promover main. Un estado mixto
requiere reversión o revisión. La recuperación no reconstruye imágenes.

El modo `--build-only` deja main sin cambios. Para activar después el conjunto
construido, ejecutar dentro del servidor:

```bash
python3 /home/desarrollo/intranet/releases/<version>/release.py deploy
```

Y después `./subir-intranet.sh --recover <version>` en el equipo local. Una
reversión ejecutada únicamente en el servidor también requiere reconciliar main
con `--rollback` local. No se debe sincronizar main mientras esa recuperación esté
pendiente. Si falta el recibo local, deben recuperarse sus metadatos antes de mover
ramas automáticamente.

## Configuración verificada el 16 de noviembre de 2026

| Proyecto | Carpeta en /home/desarrollo/intranet | Contenedor | Público → interno | Repositorio de imagen |
|---|---|---|---|---|
| smcapis | smc-api | smcapis-container | 8085 → 8083 | smcapis |
| api-departamentos | departamentos | api-departamentos-container | 8086 → 8085 | api-departamentos |
| api-funcionarios | funcionarios | api-funcionarios-container | 8088 → 8084 | api-funcionarios |
| newsolicitudes | new-solicitudes | new-solicitudes-container | 8087 → 8081 | newsolicitudes |
| app-feriados | app-feriados | app-feriados | 8090 → 5173 | image-app-feriados |

Los cuatro `.env` coinciden con los contenedores. MySQL está en `192.168.10.43`;
SQL Server de SMC en `192.168.10.28:1433`, base `municipalidad`. Se conserva la red
`laflorida`, el volumen `/home/desarrollo/Documentos/rrhh`, la clave CeroPapel y
las conexiones existentes de firma, correo y documentos. No se modifican secretos.
El frontend no tiene `.env` remoto: API del mismo origen `/solicitudes/` y menú
`https://intranet.laflorida.cl/home`.

Nginx conserva `/feriados/` hacia `192.168.10.49:8090/` y `/solicitudes/` hacia
`192.168.10.49:8087/solicitudes/`. Las pruebas del proxy usan el encabezado
`Host: intranet.laflorida.cl`. No se modifica Nginx ni servicios ajenos.

## Construcción, respaldo y validación

Antes de escribir o preparar commits se consulta el estado remoto. Luego se
transfieren solo los paquetes nuevos, sin `.git`, `.env`, claves, dependencias ni
builds locales. Docker se ejecuta en intranet; no se inicia en el equipo físico.
Se fijan las bases por digest y se ejecutan las pruebas seleccionadas de backend
y la compilación del frontend. No se usa ni se actualiza `latest`.

Antes del reemplazo se prueban candidatos de todo el conjunto con puertos
transitorios y volúmenes de datos en lectura. No reinician los servicios activos.
Se conserva diagnóstico privado si fallan. Se respaldan las imágenes de los
servicios que cambiarán en etiquetas `rollback-*` y un archivo Docker, además de
sus configuraciones y las bases MySQL afectadas. Se conservan los contenedores
anteriores detenidos. Un fallo de respaldo impide reemplazar servicios.

Los `.env`, puertos, redes, alias, grupos y volúmenes se conservan. Los backends
nuevos usan Hibernate `validate`, inicialización SQL/migradores desactivados e
inicializadores de solicitudes desactivados. Un esquema o índice incompatible
falla en el candidato. No se ejecutan migraciones ni firmas/envíos reales.

La verificación comprueba los IDs de las cinco imágenes (incluidas las omitidas),
Actuator, contratos paginados y recursos del frontend. Puede existir una
indisponibilidad breve durante el reemplazo. No sustituye la validación funcional
autenticada posterior. La reversión no restaura bases automáticamente, pues podría
borrar operaciones posteriores de usuarios; los dumps quedan para recuperación
explícita.

Las publicaciones quedan en `/home/desarrollo/intranet/releases/<version>/`.
Guardan manifiestos, commits, árboles Git, paquetes de los componentes nuevos,
huellas SHA-256, bases y IDs de imágenes. `before/` contiene respaldos privados.
Los `deploy.sh` antiguos siguen apuntando a la publicación anterior: usar este
flujo para mantener coordinadas las imágenes y main. La política es específica
para intranet; no configura otro servidor de producción sin inspeccionarlo.

## Pruebas

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s deploy/intranet/tests -v
bash -n subir-intranet.sh
./subir-intranet.sh --dry-run
```

Se probó Git real en repositorios temporales: integración sin promover main,
omisión de commits activos, conflictos, commits pendientes, movimientos
concurrentes, reversión con main abierto y rechazo de credenciales. También se
prueba que los servicios omitidos no se renombren, detengan ni recreen. Se consultó
el estado real de intranet en modo de solo lectura; no se ha desplegado este flujo.
