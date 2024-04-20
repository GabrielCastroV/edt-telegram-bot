# Asistente Virtual EDTécnica

## Introducción

El Asistente Virtual EDTécnica es un bot de Telegram desarrollado para brindar información a los estudiantes y futuros estudiantes de la neouniversidad EDTécnica. El bot ofrece una interfaz interactiva para explorar los cursos disponibles, conocer la ubicación de la sede, obtener respuestas a preguntas frecuentes e incluso realizar el proceso de inscripción y pago de cursos.

## Tecnologías Utilizadas

El bot está construido utilizando las siguientes tecnologías:

- Lenguaje de programación: JavaScript
- Entorno de ejecución: Node.js
- Librerías:
  - `dotenv`: Administración de variables de entorno
  - `mongoose`: Modelado de datos con MongoDB
  - `nodemailer`: Envío de correos electrónicos
  - `telegraf`: Desarrollo de bots de Telegram
  - `venecodollar`: Conversión de divisas (USD a VES)

## Funcionalidades del Bot

El bot ofrece las siguientes funcionalidades:

- **Información General**:
  - `/start`: Muestra información general sobre EDTécnica y presenta un menú con opciones para explorar cursos, ubicación y preguntas frecuentes.
  - `/ubicacion`: Envía un mapa de Google Maps con la ubicación de la sede de EDTécnica y la dirección completa.
  - `/preguntas`: Muestra un texto con preguntas frecuentes y sus respectivas respuestas.
  
- **Cursos**:
  - `/cursos`: Presenta un menú con opciones para explorar los diferentes cursos disponibles, incluyendo información detallada sobre cada uno, como descripción, plan de estudios, duración, horarios, precios y opciones de pago.
  
- **Inscripción**:
  - Permite a los usuarios realizar el proceso de inscripción en un curso seleccionado. El bot ofrece dos métodos de pago:
    - **Pago Móvil**: El bot solicita al usuario su correo electrónico, calcula el precio en bolívares a tasa del Banco Central en tiempo real, pide los cuatro últimos dígitos del número de referencia y el monto a pagar. Tras la validación de los datos, el bot envía un correo electrónico con la información de pago y procesa la solicitud.
    - **Tarjeta de Crédito**: El bot utiliza la pasarela de pago de Telegram para procesar pagos con tarjeta de crédito. El usuario debe ingresar un número de tarjeta de prueba (4242-4242-4242-4242-4242), su número de teléfono, correo electrónico y nombre. Al completar el pago, el usuario recibe un correo electrónico de confirmación.
    
- **Acceso a notas y pagos para estudiantes**:
  - `/login`: Permite a los estudiantes registrados en EDTécnica acceder a su información personal, notas, pagos y realizar pagos de mensualidades. El proceso de login se realiza mediante validación de correo electrónico y código aleatorio enviado al correo del usuario.
  - **Consulta de notas**: El bot muestra al usuario sus notas, promedio general, nota acumulada para la nota final, información del curso, modalidad (presencial u online), fecha de pago, módulo actual y monto a cancelar.
  - **Pago de mensualidad**: El bot permite al usuario realizar el pago de su mensualidad utilizando Pago Móvil. El proceso es similar al de la inscripción, solicitando al usuario los cuatro últimos dígitos del número de referencia y el monto a pagar.
  
- **Administración de pagos**:
  - El bot se complementa con una web de administración para validar pagos de inscripción y mensualidades. Esta web está diseñada para uso exclusivo del administrador del bot.

## Creación de usuarios de prueba

Para probar el bot como estudiante, los usuarios pueden crear un usuario ficticio en el apartado https://virtualassistantweb.onrender.com/create/

## Métodos de pago:

- **Pago Móvil**: Se utiliza la librería `venecodollar` para convertir el monto a pagar de Dolares (USD) a Bolivares (VES) según la tasa del Banco Central en tiempo real. El bot valida la información del pago y envía un correo electrónico de confirmación al usuario.

- **Tarjeta de Crédito**: Se utiliza la pasarela de pago de Telegram para procesar pagos con tarjeta de crédito. El bot verifica la información de la tarjeta y envía un correo electrónico de confirmación al usuario.

## Validación de datos:

Todas las secciones del bot implementan validación de datos para garantizar la entrada de información correcta por parte del usuario. Se utilizan expresiones regulares para validar correos electrónicos, números de teléfono, formatos de pago, etc.

## Base de datos:

Se utiliza MongoDB como base de datos para almacenar la información de los usuarios, cursos, pagos y notas. La librería mongoose facilita el modelado y la interacción con la base de datos.

