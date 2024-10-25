# API bibliotecaWeb

## Instrucciones de configuracion

1. Clona este repositorio
    - bash: 
    git clone url_del_repositorio

2. Crea un archivo .env en la raiz ddel proyecto siguiendo el archivo de ejemplo .env.example

3. Asegurate de tener instalado MariaDB o puedes usar MySQL

4. Crea una base de datos vacía en tu servidor de MariaDB
    CREATE DATABASE nombre_base_de_datos;

5. Usando el archivo dump.sql importa la estructura de las tablas
    mysql -u tu_usuario -p tu_contraseña nombre_base_de_datos < database/dump.sql

6. Instala las dependencias del proyecto:
    npm install

7. Inicia la API:
    npm start
