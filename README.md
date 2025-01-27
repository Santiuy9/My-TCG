----------

# MyTCG - Game of Cards Backend & Frontend
## Descripción

Este proyecto es el desarrollo de un **juego de cartas coleccionables** (TCG, por sus siglas en inglés), que tiene tanto **backend** como **frontend**. El juego permite a los jugadores coleccionar cartas y batallar entre sí, utilizando mecánicas como habilidades, invocación de héroes y estrategias basadas en cartas de tipo **Heroes**, **Nexo**, **Hechizo** y **Artefacto**.

### Backend (Servidor)

El backend de este proyecto está construido con **Node.js**, **Express** y **MongoDB**, brindando funcionalidades esenciales como el registro de usuarios, autenticación con **JWT tokens** y almacenamiento de **productos**, **categorías** y **cartas** en la base de datos. Se utilizan **endpoints RESTful** para realizar solicitudes para obtener, crear, actualizar y eliminar datos en el juego.

El backend incluye una lógica para gestionar tanto la compra de cartas en la tienda como la interacción entre los jugadores y sus cartas en batallas.

### Frontend (Interfaz de Usuario)

El frontend está desarrollado con **React** y se conecta con el backend para crear una experiencia de usuario fluida, permitiendo interacciones dinámicas a través de un **panel de juego** para que los jugadores puedan gestionar sus cartas y participar en **duelos**.

----------
# Documentación del Proyecto

  

## Requisitos previos

  

Para utilizar este proyecto, necesitas instalar lo siguiente:

  

-  **Postman** (para probar los endpoints). Descargar [aqui](https://www.postman.com/downloads/)

-  **MongoDB** (base de datos para almacenar los datos). Descargar [aqui](https://www.mongodb.com/try/download/community)

(Opcional) Instalar **MongoDB Compass**. Este método te permitirá realizar más consultas de forma visual.

  

---

  

## Pasos Iniciales (Backend)

  

1. Clona el repositorio desde [GitHub](https://github.com/Santiuy9/MyTCG).

2. Abre el proyecto en tu IDE preferido.

3. Configura el archivo `.env` según las variables de entorno preferidas. Este archivo viene preconfigurado con valores genéricos por defecto.

4. Abre la Terminal Integrada de tu IDE.

5. Navega hasta la carpeta **backend** con el siguiente comando:

```bash
cd backend
```

6. Instala las dependencias ejecutando:

```bash
npm install
```

7. En una nueva terminal de PowerShell o CMD, inicia el servidor de MongoDB con:

```bash
mongod
```

  

(Opcional) Si quieres ver la interfaz de la base de datos generada de manera dinámica, abre **MongoDB Compass** y conéctalo al puerto correspondiente.

  

----------

## Pruebas de Endpoints en Postman

  

### 1. Endpoints para Usuarios

  

**Registrar usuario**
-  **URL:**  `http://localhost:3000/api/auth/register`
-  **Método:**  `POST`
-  **Body (raw, JSON):**

```json
{
	"username": "test_usuario",
	"email": "usuario@test.com",
	"password": "test123"
}
```
---
**Iniciar sesión**
-  **URL:**  `http://localhost:3000/api/auth/login`
-  **Método:**  `POST`
-  **Body (raw, JSON):**

```json
{
	"username": "test_usuario",
	"password": "test123"
}
```

- Copia el **token** de la respuesta para usarlo en las siguientes peticiones.
---
**Consultar perfil de usuario**
-  **URL:**  `http://localhost:3000/api/auth/me`
-  **Método:**  `GET`
-  **Header:**
	- **Key:** `Authorization`
	- **Value:** `Bearer {Token Copiado}`
---
**Actualizar usuario**
-  **URL:**  `http://localhost:3000/api/auth/:username`
-  **Método:**  `PUT`
-  **Body (raw, JSON):**

```json
{
	"username": "usuario_uy123",
	"email": "email@test.com"
}
```
()

---
**Eliminar usuario**

-  **URL:**  `http://localhost:3000/api/auth/delete-user`
-  **Método:**  `DELETE`
-  **Body (raw, JSON):**

```json
{
	"username": "Santu_uy",
	"password": "test123"
}
```
(Recuerda remplazar el Value de "username" en el cuerpo de la solicitud por el nombre de usuario al que deseas eliminar)
(Recuerda remplazar el Value de "password" en el cuerpo de la solicitud por la contraseña del usuario al que deseas eliminar)
  

----------

  

### 2. Endpoints para Categorías

  

**Crear categoría**

-  **URL:**  `http://localhost:3000/api/store/categories`
-  **Método:**  `POST`
-  **Body (raw, JSON):**

```json
{
	"name": "Booster Packs",
	"description": "Categoría para comprar los mejores sobres del juego."
}
```
---
**Consultar todas las categorías**

-  **URL:**  `http://localhost:3000/api/store/categories`
-  **Método:**  `GET`
-  **No necesita Body.**
---
**Consultar categoría por nombre**

-  **URL:**  `http://localhost:3000/api/store/categories?name=:nombreDeCategoria`
-  **Método:**  `GET`
-  **No necesita Body.**

(Recuerda reemplazar el ":nombreDeCategoria" del URL con el nombre de la categoría que deseas obtener)
(Recuerda reemplazar el espacio con `%20` si el nombre tiene un espacio).

---
**Actualizar categoría**

-  **URL:**  `http://localhost:3000/api/categories/:name`
-  **Método:**  `PUT`
-  **Body (raw, JSON):**

```json
{
	"name": "Paquete de Sobres",
	"description": "Compra aquí tus sobres para obtener cartas"
}
```
(Recuerda reemplazar el ":name" del URL con el nombre de la categoría que deseas eliminar)

---
**Eliminar categoría**

-  **URL:**  `http://localhost:3000/api/categories/:name`
-  **Método:**  `DELETE`
-  **No necesita Body.**

(Recuerda reemplazar ":name" con el nombre de la categoría que deseas eliminar)
(Recuerda reemplazar el espacio con `%20` si el nombre tiene un espacio).

  

----------

  

### 3. Endpoints para Productos

  

**Crear producto**
-  **URL:**  `http://localhost:3000/api/store/products`
-  **Método:**  `POST`
-  **Body (raw, JSON):**

```json
{
	"name": "Viajes en el Tiempo",
	"type": "booster",
	"description": "Booster de Inicio para comenzar tus Batallas",
	"priceInMoney": 200,
	"priceInTokens": 20,
	"image_url": "../src/assets/booster_pack.jpg",
	"cardsList": [
		{"cardId": "ES-A001", "weight": 15},
		{"cardId": "ES-A002", "weight": 15},
		{"cardId": "ES-A003", "weight": 15},
		{"cardId": "ES-A004", "weight": 5}
	],
	"category": "{id de la categoria}"
}
```

_(Importante: sustituir `{id de la categoria}` por el ID correspondiente de la categoría)_.

---
**Consultar todos los productos**

-  **URL:**  `http://localhost:3000/api/store/products`
-  **Método:**  `GET`
-  **No necesita Body.**
---
**Actualizar producto**

-  **URL:**  `http://localhost:3000/api/store/products/:name`
-  **Método:**  `PUT`
-  **Body (raw, JSON):**

```json
{
	"name": "Tempestad Temporal",
	"type": "booster",
	"description": "Destruye el espacio y el tiempo con estas cartas",
	"priceInMoney": 750,
	"priceInTokens": 50
}
```
(Recuerda reemplazar ":name" con el nombre del producto que deseas actualizar)

---

**Eliminar producto**

-  **URL:**  `http://localhost:3000/api/store/products/:name`
-  **Método:**  `DELETE`
-  **No necesita Body.**

  (Recuerda reemplazar ":name" con el nombre del producto que deseas eliminar)

----------

  

## Aclaraciones

  

- Los endpoints para crear y actualizar utilizan JSON en el body, donde las propiedades deben coincidir con las esperadas por el modelo.

- Reemplaza `:name`, `:username` o `:nombreDeCategoria` con los valores correspondientes al realizar solicitudes específicas.

- Las rutas que contienen espacios deben codificar esos espacios como `%20` para garantizar su correcta interpretación.

  

----------

  

¡Listo para comenzar las pruebas! Si tienes algún problema o duda adicional, no dudes en preguntar.

  

```
Este README está diseñado para ser claro y conciso, con la estructura adecuada para que el usuario siga los pasos sin complicaciones. Los campos como las rutas con parámetros o valores específicos (como los nombres de productos o categorías) se marcan para ser fáciles de identificar y reemplazar.
```


# Gracias por llegar hasta aquí! <3

## Importante

Si quieres hacer pruebas en el Frontend y probar el Juego es necesario que sepas que el juego aun esta en desarrollo y queda mucho por construir.
Actualmente el sitio contiene algunas paginas que podrás explorar:
- Álbum con las cartas creadas especialmente para este sitio.
- Una tienda funcional donde con tus Monedas o Tokens podrás comprar sobres para conseguir nuevas cartas.
- Y también posee un sitio de batallas que actualmente esta en desarrollo y sus funcionalidades no están completas.

---

## Requisitos previos

Damos por hecho que tienes la parte del Backend del proyecto funcionando con el servidor de MongoDB levantado en la Terminal de Comandos y las dependencias correspondientes instaladas, si no es así realiza los [**Pasos Iniciales (Backend)**](#pasos-iniciales-backend) que están al principio del documento.

## Pasos Iniciales (Frontend)

1. Desde el directorio raíz del proyecto abre la Terminal Integrada de tu IDE de preferencia.

2. Navega a la carpeta Frontend con el siguiente comando.

```bash
cd frontend
```
3. Instala las dependencias con el comando.

```bash
npm install
```

4. Ya esta todo listo para levantar el servidor con el comando.

```bash
npm run dev
```

5. Abre tu Navegador de preferencia y navega a: 

```
http://localhost:5173/
```

6. Por otro lado ingresa en MongoDB Compass y crea una nueva base de datos con el nombre "MyTCG-Database".

7. Dentro de la base crea tres colecciones nuevas ("Users", "Cards" y "Products").

8. Ahora ingresa en la coleccion "Products" dentro de MongoDB, clickea el boton verde "ADD DATA", elige la opcion "Import JSON or CSV file" y navega en el explorador de archivos emergente hasta la carpeta del proyecto, entra en la carpeta "backend" y ahi elige el archivo "respaldoDeProductos.json" y en la ventana emergente clickea "Import".

9. Ahora ingresa en la coleccion "Cards" dentro de MongoDB, clickea el boton verde "ADD DATA" y elige la opcion "Import JSON or CSV file", navega en el explorador de archivos emergente hasta la carpeta del proyecto, entra en la carpeta "backend" y ahi elige el archivo "respaldoDeCartas.json" y en la ventana emergente clickea "Import".

10. Felicidades ya estas listo para explorar el Juego.

## Dentro del sitio

### Iniciar Sesión y Registro de nuevo Usuario 

Lo primero que debes realizar es el Registro de un nuevo Usuario.
Al llegar a la pagina principal y no estar logueado, necesitas crear un usuario, para ello en la pagina principal tienes un botón "Iniciar Sesión" que te lleva a la pagina donde podrás Iniciar Sesión y también Registrar un nuevo usuario.
Ya en la página de Login aparece el recuadro con dos pestañas (Iniciar Sesión y Registrarse) para ingresar las credenciales de Inicio de Sesión o Registro de usuario.
Esta parte del sitio es bastante dinámica e intuitiva para los usuarios.
Al loguearse el Usuario será dirigido directamente a la pagina principal del sitio.
(Recuerda que debes tener en funcionamiento el backend del proyecto para hacer funcionar el Login y/o Registro del sitio)

---

### Pagina Inicial del Sitio "Home.jsx"

Ya logueado en el sitio el Usuario se encuentra en el componente principal del sitio.
Aquí el Usuario podrá dirigirse directamente a otras páginas dentro del sitio mediante la lista de botones que aparecen:

- **Jugar** (En desarrollo) Es donde el Usuario podrá medirse en Batalla en modo PvE y modo PvP.
- **Editar Mazo** Aquí es donde el Usuario puede Editar las cartas que tiene en su inventario y añadirlas a su Mazo en la medida que el Usuario lo quiera.
- **Tienda** La Tienda del juego es donde el Usuario podrá conseguir sus cartas con las distintas monedas del juego.
- **Album** El Álbum es donde aparecen todas las cartas que están disponibles en el Juego hasta el momento.

### Pagina para Batallas "Play.jsx"

Al clickear Jugar el Usuario sera dirigido al componente Play.jsx, una pagina donde encontrara como comenzar a Jugar.
(Tener en cuenta que esta Pagina aun no esta desarrollada por completo).
Para comenzar el Usuario debe clickear en el Boton "Batalla", entonces se extendera la pantalla completa para una mejor experiencia en la batalla.
Se le dara al Usuario la opcion de elegir Cara o Cruz en una especie de simulacion de lanzamiento de moneda, si acierta el Jugador comenzara la partida en primer lugar.
Luego procedera la fase de colocar una Carta Nexo en el campo, dependiendo de la consistencia del Mazo que debio armar el Usuario previamente, se le dara a elegir una lista de Cartas Nexo de su Mazo y en que posicion jugar la carta.
Hecho esto, automaticamente cada jugador roba 5 cartas y comienza la partida.
El jugador puede colocar cartas de Heroe en las zonas correspondientes (Las 9 zonas frontales de su campo(Parte del tablero de color Violeta)), arrastrando las cartas desde su mano a la zona correspondiente.
El turno se ira intercambiando con la IA.
Hasta ahora, esto es lo unico implementado en la parte de batalla.
Aun queda mucho por desarrollar y agradecemos tu interes por llegar hasta aqui.

### Pagina donde Editar el Mazo del Usuario "Deck.jsx"

En principio, cuando el Usuario llega aqui la pagina esta vacia.
Para observar contenido, el Jugador debe comprar previamente sobres en la tienda del sitio.
El componente funciona de la siguiente manera:
En "Inventario" el Jugador podra observar todas las cartas que posee (Nombre, Imagen y Cantidad).
Para agregar las cartas a su Mazo, el Jugador debe arrastrar las cartas desde el inventario a la zona "Mazo Activo".
Las cartas que se observan en la zona "Mazo Activo" son las cartas que el Jugador tiene en su Mazo. Para que estas cartas se guarden correctamente, el jugador debe clickear el boton "Guardar Mazo Activo".
Para quitar una carta del Mazo, el Juugador debe arrastrar inversamente las cartas desde "Mazo Activo" hacia la zona "Inventario". Para que el cambio se guarde correctamente, el Jugador debe clickear al boton "Guardar Mazo Activo".
Las cartas que sean guardadas en el Mazo Activo del jugador seran las que aparezcan durante la Batalla como el Mazo del Jugador.

### Tienda del Juego "Store.jsx"

Bienvenido a la Tienda del Juego, aqui podras comprar sobres para conseguir nuevas Cartas.
Cada sobre tiene 5 cartas.
Existen dos formas de comprar los sobres, con Monedas o con Tokens. Cada forma tiene un precio distinto, aunque no cambia el resultado.
Algunas cartas son más dificiles de conseguir que otras.
(Ten en cuenta que aun nos falta por crear una funcion para mostrar las cartas que te tocan de manera dinamica, si deseas saber que cartas te tocaron debes navegar a "Editor de Mazo" ahi veras en tu inventario las cartas que te han tocado en la tienda).

### Album de Cartas "Album.jsx"

Aqui puedes observar todas las cartas disponibles creadas hasta este momento unicamente para el juego. (Son pocas, pero estamos trabajando en crear más para más diversion)
Tambien esta el Boton para ver las cartas desde el "Album" oficial del Juego, de una manera distinta y más llamativa.

## Agradecimiento

Nuevamente te agradecemos por llegar hasta aqui, esperamos que nuestro esfuerzo en el actual desarrollo te haya hecho querer ver mas de nuestro trabajo.
Queremos y agradecemos que nos hagas llegar un feedback para seguir mejorando en base a la opinion de nuestros "BetaTesters".
Nuestro TCG seguira expandiendose para brindar mas diversion a nuestros futuros usuarios.
Gracias por formar parte.