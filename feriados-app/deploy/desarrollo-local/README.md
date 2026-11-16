# Desarrollo local: cinco proyectos con una versión conjunta

Desde `feriados-app`:

```bash
./subir-desarrollo-local.sh
```

Ahora construye y actualiza **smcapis, api-departamentos, api-funcionarios,
newsolicitudes y app-feriados**. El destino exclusivo es `server-app`
(`192.168.122.65`); requiere contraseña SSH y sudo de `desarrollo`.
Docker del equipo físico no se utiliza ni se inicia. Los paquetes se suben primero
a una carpeta temporal privada del usuario en la VM; después `sudo` crea la
publicación protegida en `/opt/qa-replica` y copia los archivos con modo 600.
La carpeta temporal se retira al terminar. No se necesitan permisos de escritura
del usuario `desarrollo` sobre `/opt/qa-replica`.

## Versiones y comandos

```bash
# Validar contextos y ver commits, cambios y huellas, sin conectarse:
./subir-desarrollo-local.sh --dry-run

# Construir y desplegar con una etiqueta explícita, nueva:
./subir-desarrollo-local.sh qa-20261116-conjunto01

# Solo construir las cinco imágenes, sin reemplazar contenedores:
bash deploy/desarrollo-local/publicar.sh qa-20261116-conjunto02
```

La versión automática es `qa-AAAAMMDD-HHMMSS-huella`, con hora de Chile.
Las cinco imágenes comparten la etiqueta:

- `image-smcapis:<version>`
- `image-api-departamentos:<version>`
- `image-api-funcionarios:<version>`
- `image-newsolicitudes:<version>`
- `image-app-feriados:<version>`

No se usa `latest`, no se sobrescriben versiones y no se crean commits ni tags
Git. Se incluyen los cambios locales y archivos nuevos que pertenezcan al
contexto de compilación. Los cuatro backends se buscan junto a `app-feriados`
en `/home/mirko/Documentos/Fuentes/`. Para otra ubicación se puede indicar
`FERIADOS_PROJECTS_ROOT`; `FERIADOS_SOURCE` identifica el frontend.

## Qué se guarda

Dentro de la VM, cada publicación queda en:

```text
/opt/qa-replica/feriados-stack-releases/<version>/
```

`manifest.json` registra los cinco commits, estado Git, archivos incluidos,
archivos nuevos incluidos, SHA-256 reproducible de cada paquete y huellas de
las herramientas de publicación. `built.json` agrega imágenes y sus IDs,
Dockerfiles fijados por digest, bases, pruebas seleccionadas y configuración
no secreta de compilación/ejecución. Se conservan paquetes y fuentes.

Solo se transfieren fuentes y archivos necesarios para compilar. Se excluyen
`.git`, `node_modules`, `target`, `dist`, `.env*`, claves privadas y temporales.
Las credenciales siguen en la configuración externa existente de la VM.

## Construcción y pruebas

Se construyen secuencialmente las cinco imágenes dentro de la VM. Los
backends usan Java 21 y Maven Wrapper; ejecutan las pruebas unitarias
seleccionadas y empaquetan el JAR. Las pruebas anotadas con `@SpringBootTest`,
`@DataJpaTest` o `@DataJdbcTest` se enumeran como no ejecutadas durante el
build, porque requieren un contexto/base específico. No se ejecutan contra
las bases reales. El frontend ejecuta `npm ci` y `npm run build`.

Antes de reemplazar servicios, se crean cinco candidatos con nombres y puertos
temporales. Los backends conservan las variables y red existentes, con sus
volúmenes montados en lectura. Los candidatos se conectan entre sí mediante
URLs temporales, incluyendo la dependencia circular funcionarios/departamentos.
Se admite una red Docker común para los cuatro backends o que todos utilicen
`network_mode: host`; otra topología se rechaza antes del reemplazo.

Las comprobaciones cubren:

- Actuator `UP` en los cuatro backends.
- Catálogo JSON de SMC, listado de departamentos y búsqueda paginada de funcionarios.
- Contratos paginados de usuarios y módulos en solicitudes.
- Versión, página React, recursos compilados y 404 de recursos inexistentes.

No se imprimen datos devueltos por las API ni credenciales. SQL Server y los
servicios de firma, correo y documentos siguen siendo dependencias existentes;
estas comprobaciones no validan flujos autenticados ni envíos reales.

## Base de datos e inicialización

Tanto los candidatos como los backends desplegados por este flujo usan
`ddl-auto=validate`, `spring.sql.init.mode=never` y Flyway/Liquibase desactivados.
No se crean tablas ni se migra el esquema automáticamente. En `newsolicitudes`
se establece `app.inicializacion.habilitada=false`, que evita completar autores
y registrar módulos/configuración al arrancar. Fuera de este flujo el valor
predeterminado sigue siendo `true` y conserva el comportamiento anterior.

**La base debe tener previamente el esquema y los datos de configuración
necesarios.** Si falta una migración o el índice UNIQUE de RUT requerido por
api-funcionarios, el candidato falla y se conserva el conjunto actual. Este
comando no incluye migraciones, modificaciones de permisos ni credenciales.

## Reemplazo y reversión

Se identifican los servicios por su nombre, `container_name` o imagen en
`/opt/qa-replica/compose.json`. Una identificación ambigua detiene la publicación.
Se preservan puertos, redes, variables y volúmenes de los backends. Se retira
el montaje del build del frontend para servir los archivos de la imagen.
Se sustituyen las opciones de arranque antiguas por las del nuevo JAR y la
política de validación; las URLs entre estos cuatro backends apuntan a los
servicios locales. Nginx y los servicios ajenos no se modifican.

Antes del reemplazo, cada intento guarda su configuración protegida (modo 600),
cinco etiquetas `rollback-*` que conservan las imágenes anteriores, y un script
de recuperación. Los contenedores se actualizan con `up -d --no-deps`, sin
apagar el Compose completo. Puede haber indisponibilidad breve durante el
reemplazo secuencial; no es un despliegue sin interrupción.

Después se comprueban las cinco imágenes activas, las API y la ruta pública
`http://server-app/feriados/`. Si falla, se intenta recuperar **los cinco
servicios** y se comprueban sus imágenes y disponibilidad anteriores. Si falla
la reversión, el proceso se detiene y muestra el comando de recuperación.

Cada despliegue imprime la ruta concreta del script de reversión. Dentro de
la VM, se ejecuta así:

```bash
sudo bash /opt/qa-replica/feriados-stack-releases/<version>/<intento>/rollback.sh
```

También se puede volver a desplegar un conjunto ya construido:

```bash
sudo bash /opt/qa-replica/feriados-stack-releases/<version>/release.sh deploy <version>
```

La reversión restaura imágenes y configuración, no deshace operaciones de
usuarios realizadas durante el tiempo en que una versión estuvo activa. No
se eliminan imágenes antiguas ni volúmenes de datos. `current.json` registra
el último despliegue o reversión comprobado.

## Verificación local del flujo

```bash
bash -n subir-desarrollo-local.sh deploy/desarrollo-local/publicar.sh deploy/desarrollo-local/release.sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s deploy/desarrollo-local/tests -v
./subir-desarrollo-local.sh --dry-run
```

Estas comprobaciones no sustituyen la construcción ni las pruebas reales en
la VM. El flujo anterior de publicaciones de solo frontend permanece en
`/opt/qa-replica/feriados-releases/`; no se convierte en un conjunto de cinco
imágenes. El comando del proyecto usa ahora `feriados-stack-releases/`.

Si falla un candidato, se guardan su estado y los últimos 200 registros en
`candidate-failure-*/` dentro de la publicación, antes de retirarlo. Los registros
son privados (600) y el directorio 700; no se imprimen cuerpos de API ni logs
completos en pantalla. El mensaje muestra el código HTTP o tipo/errno de conexión.
El frontend ejecuta Nginx sin privilegios con PID en `/tmp/nginx.pid`.
