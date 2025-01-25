# Proyecto Completo: Predicción de Valor de Compra

Este proyecto te guía a través de los pasos para construir una aplicación con un **backend en FastAPI** (hospedado en **AWS EC2**) y un **frontend en React Native**. La aplicación permite predecir el valor de la compra en función de varias características.

## Requisitos

### Backend (FastAPI)
- **AWS EC2** con Ubuntu
- **FastAPI** para el backend
- **Modelo de Regresión Lineal** guardado con **Joblib**

### Frontend (React Native)
- **Windows 11** para el desarrollo
- **React Native** CLI
- **Axios** para hacer solicitudes HTTP

---

## 1. **Backend - FastAPI en AWS EC2**

### 1.1 **Configurar la Instancia EC2 en AWS**

1. Inicia una nueva **instancia EC2** en AWS (elige Ubuntu como sistema operativo).
2. Abre un puerto en el grupo de seguridad (por ejemplo, puerto **8080**) para permitir acceso a la API.
3. **Conéctate** a la instancia EC2 con SSH:

   ```bash
   ssh -i "tu_clave.pem" ubuntu@<tu_ip_ec2>

---

### 1.2 Instalar Dependencias en el Servidor EC2
Una vez dentro de tu instancia EC2, instala Python 3, FastAPI y las dependencias necesarias:

 ```bash
**Actualizar los paquetes**
sudo apt update
 ```

**Instalar pip y virtualenv**
 ```bash
sudo apt install python3-pip python3-venv
 ```

**Crear y activar un entorno virtual**
 ```bash

python3 -m venv myenv
source myenv/bin/activate
 ```

**Instalar FastAPI, Uvicorn y Joblib**
 ```bash
pip install fastapi uvicorn joblib scikit-learn
 ```

### 1.3 Subir el Modelo de Regresión Lineal al Servidor EC2

Si ya tienes un modelo de regresión entrenado y guardado como modelo_regresion.bin y un escalador scaler.bin, usa SCP para transferir los archivos al servidor EC2.

 ```bash
scp -i "tu_clave.pem" modelo_regresion.bin ubuntu@<tu_ip_ec2>:/home/ubuntu/
scp -i "tu_clave.pem" scaler.bin ubuntu@<tu_ip_ec2>:/home/ubuntu/
 ```

### 1.4 Crear la API FastAPI

Crea un archivo app.py en tu instancia EC2 para definir la API que servirá las predicciones.

 ```bash
nano app.py
 ```

 ```python

from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Cargar el modelo y el escalador
modelo = joblib.load("modelo_regresion.bin")
scaler = joblib.load("scaler.bin")

# Crear la aplicación FastAPI
app = FastAPI()

# Definir el esquema de entrada
class InputData(BaseModel):
    edad: float
    ingresos: float
    experiencia: float
    satisfaccion: float

@app.post("/predict/")
async def predict(data: InputData):
    # Preprocesar la entrada y hacer la predicción
    entrada = np.array([[data.edad, data.ingresos, data.experiencia, data.satisfaccion]])
    entrada_escalada = scaler.transform(entrada)
    prediccion = modelo.predict(entrada_escalada)
    return {"prediccion": prediccion[0]}
 ```

### 1.5 Ejecutar el Servidor FastAPI

Para ejecutar el servidor de FastAPI, usa Uvicorn:

 ```bash

uvicorn app:app --host 0.0.0.0 --port 8080 --reload
 ```bash

La API estará disponible en http://<tu_ip_ec2>:8080.

---

# 2. Frontend - React Native en Windows 11
## 2.1 Instalar Node.js y npm

Descarga e instala Node.js desde la página oficial. Esto también instalará npm (el gestor de paquetes de Node).

Verifica la instalación ejecutando:

 ```bash

node -v
npm -v
 ```

2.2 Instalar React Native CLI
Usaremos el React Native CLI para crear y administrar el proyecto.

Instala el CLI globalmente:

bash
Copiar
npm install -g react-native-cli
2.3 Instalar Android Studio
Descarga Android Studio desde la página oficial.

Durante la instalación, asegúrate de instalar Android SDK, Android Virtual Device (AVD) y Android Emulator.

Configura las variables de entorno:

Abre el archivo .bashrc (o .zshrc si usas Zsh) y agrega las siguientes líneas:

bash
Copiar
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
Luego recarga el archivo:

bash
Copiar
source ~/.bashrc  # O source ~/.zshrc si usas Zsh
Crear un dispositivo virtual en Android Studio usando el AVD Manager.

2.4 Crear un Proyecto React Native
Crea un nuevo proyecto de React Native:

bash
Copiar
npx react-native init PrediccionCompra
cd PrediccionCompra
Instalar Axios para hacer solicitudes HTTP:

bash
Copiar
npm install axios
2.5 Configurar la Interfaz de Usuario
En el archivo App.js, crea la interfaz de usuario para capturar los valores y mostrar la predicción.

App.js
javascript
Copiar
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [edad, setEdad] = useState('');
  const [ingresos, setIngresos] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [satisfaccion, setSatisfaccion] = useState('');
  const [prediccion, setPrediccion] = useState(null);

  // Función para hacer la predicción
  const hacerPrediccion = async () => {
    try {
      const response = await axios.post('http://<tu_ip_ec2>:8080/predict/', {
        edad: parseFloat(edad),
        ingresos: parseFloat(ingresos),
        experiencia: parseFloat(experiencia),
        satisfaccion: parseFloat(satisfaccion),
      });

      setPrediccion(response.data.prediccion);
    } catch (error) {
      console.error('Error al hacer la predicción:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Predicción de valor de compra</Text>
      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
        value={edad}
        onChangeText={setEdad}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingresos"
        keyboardType="numeric"
        value={ingresos}
        onChangeText={setIngresos}
      />
      <TextInput
        style={styles.input}
        placeholder="Experiencia"
        keyboardType="numeric"
        value={experiencia}
        onChangeText={setExperiencia}
      />
      <TextInput
        style={styles.input}
        placeholder="Satisfacción"
        keyboardType="numeric"
        value={satisfaccion}
        onChangeText={setSatisfaccion}
      />
      <Button title="Predecir" onPress={hacerPrediccion} />
      {prediccion && (
        <Text style={styles.result}>
          Predicción de compra: {prediccion.toFixed(2)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default App;
2.6 Ejecutar el Proyecto en el Emulador Android
Abre tu emulador de Android.

En la terminal de tu proyecto, ejecuta:

bash
Copiar
npx react-native run-android
Esto ejecutará la aplicación en el emulador Android y podrás ver la interfaz con los campos de entrada y el botón para realizar la predicción.

3. Despliegue y Producción
3.1 Desplegar la API FastAPI
Si todo está funcionando correctamente, tu API FastAPI está disponible en el servidor EC2 en http://<tu_ip_ec2>:8080. Puedes configurar un servidor web como Nginx o Traefik para gestionar el tráfico o incluso usar Docker para desplegarlo de forma más robusta.

3.2 Publicar la App React Native
Una vez que hayas probado que la aplicación funciona correctamente en el emulador o dispositivo, puedes construir la aplicación para dispositivos reales (Android o iOS) y publicarla en la Google Play Store o Apple App Store si es necesario.

Conclusión
Has creado un sistema completo con un backend en FastAPI para hacer predicciones de regresión lineal y un frontend en React Native para capturar la entrada del usuario y mostrar el resultado. Ahora puedes realizar predicciones de compra desde tu dispositivo móvil utilizando tu modelo entrenado en AWS EC2.

Si tienes alguna duda o problemas al seguir los pasos, no dudes en preguntar. ¡Mucho éxito en tu proyecto!

yaml
Copiar

---

Este es el contenido completo en formato Markdown que puedes pegar en una celda de texto en **Google Colab**. Este archivo te ayudará a organizar tu proyecto y tener todo el flujo de trabajo estructurado en un solo lugar. ¡Espero que te sea útil!


