# Postman
##Instrucciones para ejecutar el backend en Postman
Una vez que tengas tu backend corriendo en tu instancia EC2 o localmente, puedes usar Postman para probar la API. Aquí te dejo un paso a paso detallado:

###Paso 1: Configurar el Backend```

>Ejecuta el servidor backend:


Asegúrate de que tu servidor esté corriendo con el comando:
```shell
uvicorn main:app --host 0.0.0.0 --port 8080
```

Si estás en una instancia de EC2, asegúrate de que la dirección IP de tu servidor esté accesible. Por ejemplo:
Dirección pública: http://<EC2-PUBLIC-IP>:8080

*Ejemplo: http://52.90.150.200:8080*

Asegúrate de que el puerto esté abierto:

En las configuraciones de seguridad de tu instancia EC2, habilita el puerto 8080 en las reglas de entrada del grupo de seguridad.
Tipo: Custom TCP Rule
Puerto: 8080
Fuente: 0.0.0.0/0 (para acceso público, úsalo solo para pruebas).
Paso 2: Configurar una solicitud en Postman

### Abre Postman:

Descarga e instala Postman si aún no lo tienes.

Crea una nueva solicitud:

Haz clic en el botón "New" en la esquina superior izquierda.
Selecciona "Request" y dale un nombre (por ejemplo, "Predict Image").
Configura la URL:

Selecciona el método HTTP como POST.

Ingresa la URL del endpoint:
Local: http://127.0.0.1:8080/predict/
En EC2: http://<EC2-PUBLIC-IP>:8080/predict/

### Añade un archivo al cuerpo de la solicitud:

Ve a la pestaña Body.
Selecciona la opción form-data.
Añade un nuevo campo:
Key: file
Type: Selecciona File.
Value: Haz clic en el botón de Select Files y elige una imagen de tu computadora (por ejemplo, una imagen .jpg).

### Envía la solicitud:

Haz clic en el botón Send.

## Paso 3: Verifica la respuesta
Si todo está configurado correctamente, recibirás una respuesta similar a esta en formato JSON:
```json

{
    "predictions": [
        {
            "class_id": "n02124075",
            "class_name": "Egyptian_cat",
            "probability": 0.934568
        },
        {
            "class_id": "n02123045",
            "class_name": "tabby_cat",
            "probability": 0.048259
        },
        {
            "class_id": "n02123159",
            "class_name": "tiger_cat",
            "probability": 0.010234
        }
    ]
}
```
Si hay un error, verás un mensaje similar a:
```json
{
    "error": "Some error message"
}
```
## Paso 4: Solución de problemas
Errores comunes:

Error 404: Verifica que estás usando el endpoint correcto (/predict/) y que el servidor está corriendo.
Connection Timeout: Asegúrate de que tu servidor esté accesible desde la red y que el puerto 8080 esté abierto en las reglas de seguridad.
Error 500: Verifica los logs en tu servidor para identificar el problema (por ejemplo, errores al cargar la imagen o el modelo).
Probar con cURL (opcional): Si Postman no funciona, prueba con cURL:

```shell
curl -X POST -F "file=@image.jpg" http://<EC2-PUBLIC-IP>:8080/predict/
```
