# Proyecto Efact Frontend

Este proyecto es una aplicación web desarrollada en **Angular** para la visualización de documentos electrónicos (XML, CDR, PDF) firmados por Efact. Permite la autenticación de usuarios y la descarga segura de comprobantes.

## 🚀 Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu entorno de desarrollo:

- **Node.js** (versión 16 o superior) - [Descargar](https://nodejs.org/)
- **Angular CLI** (versión 16 o superior) - Instalar globalmente con:
  ```bash
  npm install -g @angular/cli
  ```

## 🛠️ Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu máquina local:

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd efact-pt
    ```

2.  **Instalar dependencias:**
    Ejecuta el siguiente comando en la raíz del proyecto para descargar todas las librerías necesarias:
    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    Inicia la aplicación en modo desarrollo.
    ```bash
    ng serve
    ```
    Una vez compilado, abre tu navegador y visita `http://localhost:4200/`.

## 🧠 Decisiones Técnicas y Arquitectura

Este proyecto sigue una arquitectura modular y escalable, utilizando las últimas características de Angular para garantizar rendimiento y mantenibilidad.

### 1. Angular Moderno (v16+)
- **Standalone Components:** Se eliminaron los `NgModules` para reducir la complejidad y el tamaño del bundle, favoreciendo una arquitectura más ligera (Tree-shaking).
- **Signals:** Se utilizó `signal()` para la gestión del estado local en lugar de variables mutables o `BehaviorSubjects`. Esto ofrece una reactividad de grano fino y mejor rendimiento en la detección de cambios.
- **Control Flow:** Se empleó la nueva sintaxis de control de flujo (`@if`, `@for`) para plantillas más limpias y legibles.

### 2. Arquitectura Limpia (Clean Architecture)
El código se organiza en capas claras:
- **Core:** Servicios singleton (AuthService) y Guards.
- **Features:** Módulos funcionales (Auth, Documents) independientes.
- **Shared:** Utilidades y constantes reutilizables.
Esto facilita la escalabilidad y el mantenimiento a largo plazo.

### 3. Programación Reactiva (RxJS)
Se priorizó el uso de flujos reactivos puros:
- **Evitar `async/await`:** En lugar de mezclar Promesas con Observables, se usaron operadores como `switchMap` y `from` para mantener flujos de datos consistentes y cancelables.
- **Gestión de Suscripciones:** El uso de `HttpClient` cierra automáticamente las suscripciones, y en casos complejos se gestionan operadores de limpieza.

### 4. Entorno de Desarrollo (Proxy Inverso)
Se configuró un **Proxy Inverso** (`proxy.conf.json`) para el desarrollo local.
- **Justificación:** La API de Efact tiene restricciones CORS que impiden el acceso directo desde `localhost`. El proxy redirige las peticiones `/api` al servidor real, simulando un entorno de producción y evitando errores de bloqueo de origen cruzado.

### 5. Centralización de Constantes
Se eliminaron los "magic strings" (textos dispersos en el código) centralizándolos en `constants.ts`. Esto permite cambiar mensajes de error, endpoints o tipos de archivo desde un solo lugar, reduciendo errores humanos.

## 🛡️ Sugerencias de Seguridad

Para garantizar la integridad y seguridad de la aplicación en un entorno productivo, se recomiendan las siguientes prácticas:

### 1. Sanitización de Contenido
Actualmente, el visor XML utiliza `bypassSecurityTrustHtml` para resaltar la sintaxis.
- **Riesgo:** Esto podría permitir ataques de Cross-Site Scripting (XSS) si el XML proviene de una fuente no confiable.
- **Recomendación:** Utilizar librerías dedicadas como `prismjs` o implementar una sanitización estricta antes de inyectar HTML en el DOM, asegurando que solo se rendericen etiquetas seguras.

### 2. Almacenamiento Seguro de Token
El token de acceso se almacena actualmente en `localStorage`.
- **Riesgo:** Los tokens en `localStorage` son vulnerables a ataques XSS.
- **Recomendación:** Considerar el uso de Cookies seguras (`HttpOnly`, `Secure`, `SameSite`) para almacenar el token de sesión, lo que mitiga el riesgo de robo de credenciales mediante scripts maliciosos.

### 3. Interceptores HTTP
Se utiliza un interceptor para adjuntar el token Bearer.
- **Recomendación:** Asegurar que el token NO se envíe a dominios externos no confiables. Se sugiere implementar una lista blanca de dominios permitidos dentro del `AuthInterceptor` para evitar fugas de información.

---
*Desarrollado como parte de la evaluación técnica de Frontend.*
