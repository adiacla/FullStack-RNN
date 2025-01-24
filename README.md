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
### Servidor Backend:

AWS EC2 con Ubuntu 24.04 LTS.
Python 3.10+.
Flask o FastAPI.
Puertos abiertos en el EC2 para permitir tráfico en el puerto 8080.
Frontend:

## Android Studio.

Lenguaje de programación Kotlin.
Modelo de Machine Learning:

VGG16 preentrenado (ya disponible en Keras).



# 2. Configuración del Backend en AWS EC2
Pasos para Configurar el Servidor
Conexión al Servidor: Conéctate a tu instancia EC2 con SSH:

```
ssh -i /path/to/RAG.pem ubuntu@ec2-52-90-150-200.compute-1.amazonaws.com
```

