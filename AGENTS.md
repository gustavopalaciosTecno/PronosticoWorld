## AGENTS

Proyecto: Aplicación web del tiempo


Rol del agente: Desarrolador web experto con 12 años de experiencia.


Objetivo: crear una aplicación web que nos permita ver el tiempo de cualquier ciudad del mundo de forma sencilla y rápida, consumiendo una api externa y dando la posibilidad de ver el tiempo actual y el tiempo de los próximmas 12 horas y dando la posibilidad de guardar las diferentes ciudadades en el localstorage para verlas posteriormente.

URL del api a consumir(no requiere autenticación ni api key):
https://open-meteo.com/


Funcionalidades de la aplicación:
- Búsqueda de ciudad:
    -input para buscar la ciudad
    -boton para buscar 
    -mensaje si la ciudad no existe
    -dar sugerencias de ciuddad mientras escribimos

- Clima actual:
    -Nombre de la ciudad
    -Temperatura actual
    -Descripción del clima (soleado, nublado, lluvia, etc)
    -Ícono representativo del clima actual
    -Sensación térmica
    -Humedad
    -Velocidad del viento
    
- Clima por horas:
    -Nombre de la ciudad
    -Temperatura por horas
    -Descripción del clima por horas
    -Icono representativo por horas
    -Hora
    -Botón para guardar la ciudad.

- Localidades guardadas:
   -Botón para guardar ciudad
   -Botón para eliminar ciudad
   -Lista de ciudades guardadas
   -Eliminar ciudad
   -Evitar guardar duplicados

- Consideraciones importantes:
  -La parte de gestionar las localidaes, así como la parte de añadir localidades debe hacerse en una ventana modal.
  -Aparte tendré el buscador para buscar el tiempo de nuevas localidades.
  -El diseño de la ventana modal debe ser el mismo que el diseño de la aplicación web.
  -Una vez que tengas guardadas las localidades, podré ir dando clic en cada una de ellas para ver el tiempo actual y el tiempo de las próximas 24 horas.


Stack de tecnología:
 - HTML5
 - CSS3 (sin frameworks)
 - JavaScript (vanilla, sin frameworks)

Preferencias generales importantes:
- Todos los textos visibles en la aplicación web deben estar en Español.

Preferencias de diseño:
  - Básate en las imágenes del diseño y en el HTML del diseño que tienes en la carpeta design del proyecto.


Preferencias de estilos:
 - Eliminar TailwindCSS y pasarlo todo a CSS nativo.
 - Colores (los del diseño)
 - Uso de medidas con rem, usando un font-size base de 10px.
  -Uso de HTML5 nativo y CSS3 nativo (sin frameworks)
  - Usa buenas prácticas de maquetación css y si es necesario usa flexbox y css grid layout.
  - Que la webapp sea responsive.

Preferencias de código:
- No añadas dependencias externa
- HTML debe ser semántico
- No uses alert. confirm, prompt, todo el feeddback debe ser visual en el dom.
- No uses innerHTML, todo el contenido deber ser insertado con appendChild, o previamente creando un elemento con document.createElement.
- Cuidado con olvidar prevenir el default con los eventos en submits o clicks.
- Prioriza el código legible y mantenible
- Prioriza que el código sea sencillo de entender.
- Si el agente duda, que revise las especificaciones del proyecto y sino que pregunte  al usuario.



Estructura de archivos:
- carpeta(design - -contiene los diseños)
  -carpeta(css)
  -carpeta(js)
  -carpeta(img)
- index.html  
- AGENTS.md



