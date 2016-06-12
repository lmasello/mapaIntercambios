# mapaIntercambios
Este repositorio esta orientado a reflejar en un mapa dinamico la presencia de la FIUBA en las distintas universidades del exterior.

Los datos que se muestran actualmente son meramente ejemplos. 

## Carga de datos
Los datos se toman de una planilla Excel, la cual debe contener "nombre", "apellido", "carrera", "mail" y "universidad de destino" del alumno que realiza el intercambio. Esta planilla se procesa con el script server/excelToJson.py el cual genera un archivo .json con los datos de interes. Finalmente, este archivo .json se utiliza para generar los post request al servidor donde se almacenan los datos a traves del script uploadData.js.

Temporalmente, los datos se mantienen en el servidor donde se procesan los request (server.js).
