# dotenv-custom

`dotenv-custom` es una herramienta diseñada para simplificar la gestión de variables de entorno en tus aplicaciones Node.js. Esta herramienta permite definir y procesar las variables de entorno directamente desde los archivos `.env`, con soporte para validación, valores por defecto, tipos de datos específicos y generación automática de un archivo `example.env`.

## Descripción

`dotenv-custom` carga las variables de entorno desde archivos `.env`, permitiendo parsearlas automáticamente al tipo de dato adecuado y proporcionando una forma más eficiente y segura de manejarlas. Además, soporta tags especiales en el archivo `.env` que definen reglas como:

- **Valores por defecto**: Asignar un valor por defecto si la variable no se encuentra o está vacía.
- **Requerimientos**: Obligar a que una variable de entorno esté definida.
- **Tipos de datos**: Definir explícitamente el tipo de la variable de entorno (string, number, boolean, json).

## Instalación

Para instalar `dotenv-custom`, ejecuta el siguiente comando en tu proyecto:

```bash
npm install dotenv-custom
```

## Uso con CommonJS

```javascript
const customEnv = require("dotenv-custom");
```

## Uso con ES6

```javascript
import customEnv from "dotenv-custom";
```

## Configuración

Por defecto, `dotenv-custom` busca un archivo `.env` en el directorio de trabajo (`process.cwd()`) y carga las variables de entorno desde allí. Sin embargo, puedes especificar un archivo `.env` o múltiples archivos `.env` pasando un objeto de configuración con la propiedad `path`.

### Configuración por defecto

Si no se pasa ninguna configuración, el archivo `.env` debe estar en el directorio de trabajo (`process.cwd()`):

```javascript
customEnv();
```

### Configuración personalizada

Puedes pasar un objeto de configuración con el atributo `path` que puede ser una cadena con la ruta del archivo `.env` o un array de rutas si deseas cargar múltiples archivos.

```javascript
customEnv({
  path: "./config/.env", // ruta personalizada
});
```

Si deseas cargar múltiples archivos `.env`, puedes hacerlo de la siguiente manera:

```javascript
customEnv({
  path: ["./config/.env", "./config/another.env"], // rutas múltiples
});
```

**Nota:** Es recomendable usar rutas absolutas para evitar problemas relacionados con el directorio de trabajo.

## Uso de Tags en el archivo `.env`

En los archivos `.env`, puedes usar los siguientes tags para modificar el comportamiento de las variables de entorno.

1. `<default=value>`

Este tag asigna un valor por defecto a una variable de entorno en caso de que no se le haya asignado un valor.

```env
# Ejemplo
MYSQL_PORT=<default=3306>3307
```

Si la variable `MYSQL_PORT` no está definida en el archivo `.env`, se utilizará el valor `3307`.

2. `<required>`

Este tag marca una variable de entorno como obligatoria. Si la variable no está definida en el archivo `.env`, el programa lanzará un error antes de ejecutarse.

```env
# Ejemplo
JWT_TOKEN=<required>token-secreto
```

3. `<type=typeof>`

Este tag permite especificar el tipo de dato que debe tener la variable de entorno. Los tipos permitidos son: `boolean`, `string`, `number`, `json`.

```env
# Ejemplo
SERVICE_1_STATE=<default=true>
SERVICE_2_STATE=<default=true><type=string>false
```

- `SERVICE_1_STATE` se parseará como un `boolean`.
- `SERVICE_2_STATE` se parseará como un string debido al tag `<type=string>`.

## Ejemplo de Implementación

A continuación se muestra un ejemplo de implementación:

### Estructura del proyecto

```plaintext
mi-proyecto/
│
├── .env
├── main.ts
└── node_modules/
```

### Archivo `.env`

```env
# JWT Secret
JWT_TOKEN=<required>token-secreto

# MYSQL ENVs
MYSQL_ROOT_PASSWORD=<default=mysql-pass>secret-password
MYSQL_DATABASE=<default=test_db>
MYSQL__PORT=<default=3306>3307

# TYPE TAGS TEST
SERVICE_1_STATE=<default=true>
SERVICE_2_STATE=<default=true><type=string>false
```

### Archivo `main.ts`

```typescript
import customEnv from "dotenv-custom";

console.log(customEnv());
```

### Terminal, resultado de `console.log`:

```plaintext
{
  JWT_TOKEN: 'token-secreto',
  MYSQL_DATABASE: 'test_db',
  MYSQL_ROOT_PASSWORD: 'secret-password',
  MYSQL__PORT: 3307,
  SERVICE_1_STATE: true,
  SERVICE_2_STATE: 'false'
}
```

## Generación Automática del Archivo `example.env`

Al ejecutar `customEnv()`, la herramienta genera automáticamente un archivo `example.env` en el mismo directorio que el archivo `.env` con los tags establecidos. Este archivo servirá como ejemplo para otros desarrolladores o para documentar las variables de entorno necesarias.

### Ejemplo de `example.env`

```env
# JWT Secret
JWT_TOKEN=<required>

# MYSQL ENVs
MYSQL_ROOT_PASSWORD=<default=mysql-pass>
MYSQL_DATABASE=<default=test_db>
MYSQL__PORT=<default=3306>

# TYPE TAGS TEST
SERVICE_1_STATE=<default=true>
SERVICE_2_STATE=<default=true><type=string>
```

Este archivo no contiene valores reales, pero mantiene la estructura de los tags para que sea fácil de usar como ejemplo.

### Configuración personalizada para `example.env`

Si deseas especificar una ruta personalizada para el archivo `example.env`, puedes usar la opción `exampleEnvPath` dentro de la configuración:

```javascript
customEnv({
  path: "./config/.env",
  exampleEnvPath: "./config/example.env", // ruta personalizada para el archivo example.env
});
```

## Consideraciones Importantes

* **Rutas relativas y absolutas**: Al trabajar con rutas relativas, se usan como base ``process.cwd()``. Es recomendable usar rutas absolutas para evitar problemas cuando se ejecutan múltiples servicios en un entorno de microservicios.
* **Manejo de valores predeterminados**: Los valores por defecto solo se aplican si no se ha definido un valor explícito para la variable en el archivo ``.env``. Si la variable está vacía, el valor por defecto no se aplica.
* **Generación de example.env**: El archivo ``example.env`` se genera automáticamente en el mismo directorio que el archivo ``.env``. Si se cargan múltiples archivos ``.env``, se generará un archivo ``example.env`` para cada uno de ellos.

## Conclusión

``dotenv-custom`` proporciona una forma sencilla y robusta de manejar las variables de entorno en tus proyectos Node.js. Con soporte para validación, tipos específicos y generación automática de archivos de ejemplo, puedes gestionar tus configuraciones de manera eficiente y segura. ¡Prueba ``dotenv-custom`` y optimiza la gestión de tus variables de entorno!