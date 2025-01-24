# FullStack-RNN
Ejercicio de BackEnd y FrontEnd

## Objetivo
Desarrollar una aplicación móvil para Android que capture una foto, la envíe a un servidor backend en AWS EC2 mediante una API REST, procese la imagen usando el modelo preentrenado VGG16 para clasificar el objeto en la imagen y muestre la predicción en la aplicación móvil.

## Estructura del Taller
### Requisitos del Proyecto

1. Configuración del Backend en Ubuntu (AWS EC2)
2. Desarrollo del API con Flask o FastAPI
3. Desarrollo del Frontend en Android Studio
4. Pruebas de Integración

# 1. Requisitos del Proyecto
Herramientas y Entornos Necesarios:
## Servidor Backend:

AWS EC2 con Ubuntu 24.04 LTS.
Python 3.10+.
Flask o FastAPI.
Puertos abiertos en el EC2 para permitir tráfico en el puerto 8080.
Frontend:

# Android Studio.

Lenguaje de programación Kotlin.
Modelo de Machine Learning:

VGG16 preentrenado (ya disponible en Keras).



# 2. Configuración del Backend en AWS EC2
Pasos para Configurar el Servidor
### Lanzar un servidor EC2, con minimo 12 GB en RAM, 8 GB en Disco, Ubuntu 24.2 LTS.
Verifique en el servidor la versión de python. El proyecto ha sido testeado en >12 Versión.
>python -V
>python3 -V
>
### Conexión al Servidor: Conéctate a tu instancia EC2 con SSH:

```python
ssh -i /path/to/RAG.pem ubuntu@ec2-52-90-150-200.compute-1.amazonaws.com
```
### Instalar Dependencias Necesarias:
```
sudo apt update
sudo apt install python3-pip python3-venv -y
python3 -m venv venv
source venv/bin/activate
pip install flask fastapi uvicorn[standard] keras tensorflow pillow numpy mulpipart
```
### Configurar el Puerto 8080
Modifica las reglas del grupo de seguridad para permitir tráfico en el puerto 8080 (o cualquier otro puerto que elijas).

# Desarrollo del Backend API
Usaremos FastAPI por su rendimiento y facilidad de uso. El backend aceptará una imagen, la procesará con el modelo VGG16 y devolverá la predicción.

```python
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from keras.applications.vgg16 import VGG16, preprocess_input, decode_predictions
from keras.utils import img_to_array, load_img
import numpy as np
import uvicorn

app = FastAPI()

# Cargar el modelo VGG16
Use
>nano proyecto.py
>digite el codigo del backend en EC2

model = VGG16(weights="imagenet")

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # Leer y procesar la imagen
        image = await file.read()
        with open("temp.jpg", "wb") as f:
            f.write(image)

        img = load_img("temp.jpg", target_size=(224, 224))
        x = img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)

        # Realizar predicción
        predictions = model.predict(x)
        decoded_predictions = decode_predictions(predictions, top=3)[0]

        # Formatear las predicciones
        results = [
            {"class_id": pred[0], "class_name": pred[1], "probability": float(pred[2])}
            for pred in decoded_predictions
        ]

        return JSONResponse(content={"predictions": results})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
```
