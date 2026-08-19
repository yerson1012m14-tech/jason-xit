# JASON XIT + BASE — integración v1

Se integró la parte reutilizable de BASE (`MCMBridge` + `MCMFilzaIntegration`) dentro del target iOS de JASON XIT mediante `JASONXITFilzaBridge`.

## Integrado
- Inicialización del filesystem Filza al arrancar.
- Acceso al `Filza Storage` virtual desde el navegador nativo.
- Consulta de disponibilidad del ContainerManager.
- API para intentar resolver App Data por bundle identifier.
- Framework Security enlazado para las APIs SecTask usadas por BASE.

## No se mezcló directamente
`Tweak.m` queda fuera del target de la app porque está diseñado como tweak/dylib y depende de clases internas de Filza (`TGFileSystemListViewController`). Meterlo en una app SwiftUI no lo convierte en un módulo de filesystem usable.

## Limitación importante
Se conservaron las verificaciones de identidad de firma de `MCMFilzaIntegration`. En una app independiente, el acceso a contenedores de otras apps dependerá de que el entorno de ejecución tenga la identidad/permisos que espera esa base. No se eliminó esa protección ni se falsificó el resultado.

## Nota de compilación
No puedo ejecutar Xcode/iOS SDK en este entorno Linux, así que no afirmo que una IPA final esté compilada aquí. El proyecto Xcode y las referencias de fuentes fueron actualizados para que el build pueda hacerse en macOS/Xcode.
