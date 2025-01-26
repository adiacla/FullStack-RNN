Ejercicio de BackEnd y FrontEnd

## Objetivo
Desarrollar una aplicación móvil para Android que capture una foto, la envíe a un servidor backend en AWS EC2 mediante una API REST, procese la imagen usando el modelo preentrenado VGG16 para clasificar el objeto en la imagen y muestre la predicción en la aplicación móvil.

## Estructura del Taller
### Requisitos del Proyecto

1. Configuración del Backend en Ubuntu (AWS EC2)
2. Desarrollo del API con Flask o FastAPI
3. Desarrollo del Frontend en VsC con React Naive
4. Pruebas de Integración

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

### 1.4 Crear la API FastAPI

Crea un archivo app.py en tu instancia EC2 para definir la API que servirá las predicciones.

 ```bash
nano app.py
 ```

 ```python
Desarrollo del Backend API
Usaremos FastAPI por su rendimiento y facilidad de uso. El backend aceptará una imagen, la procesará con el modelo VGG16 y devolverá la predicción.

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from keras.applications.vgg16 import VGG16, preprocess_input, decode_predictions
from keras.utils import img_to_array, load_img
import numpy as np
import uvicorn

app = FastAPI()

# Cargar el modelo VGG16

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
Use

nano proyecto.py digite el codigo del backend en EC2

Pueba del Backend
Puedes usar la prueba manual

Prueba manual:

Usa herramientas como Postman o cURL para probar la API antes de integrarla con el frontend. Ejemplo de prueba con cURL:

curl -X POST -F "file=@image.jpg" http://ec2-54-164-41-174.compute-1.amazonaws.com:8080/predict/
Espera un JSON como respuesta con las predicciones.



```

### 1.5 Ejecutar el Servidor FastAPI

Para ejecutar el servidor de FastAPI, usa Uvicorn:

 ```bash

uvicorn app:app --host 0.0.0.0 --port 8080 --reload
 ```

La API estará disponible en http://<tu_ip_ec2>:8080.

---

# React Native en Windows 11
## 1. Instalar Node.js y npm

Descarga e instala la última versión LTS de Node.js desde la página oficial de Node.js.

Esto también instalará npm automáticamente.

> Verifica la instalación:

```bash
node -v
npm -v
```
## 2. Instalar React Native CLI
Usaremos el React Native CLI para gestionar el proyecto.

Instala el CLI de forma global:

```bash
npm install -g react-native-cli
Verifica que React Native CLI se instaló correctamente:
```

```bash
react-native -v
```
### 3. Ajustes necesarios con Android Studio instalado
Ubicación del SDK existente: Android Studio ya instala el Android SDK por defecto. La ubicación del SDK se puede encontrar en Android Studio:

** Abre Android Studio. **
Ve a File > Settings > Appearance & Behavior > System Settings > Android SDK.
Allí verás la ubicación del SDK, algo como:
```text
C:\Users\<tu_usuario>\AppData\Local\Android\Sdk
C:\Users\adiaz\AppData\Local\Android\Sdk
```
Usa esta ruta para agregar las herramientas a las variables de entorno.
Ajustar las Variables de Entorno de Windows: Agrega estas rutas a la variable Path (reemplaza <ruta_del_sdk> con la ubicación obtenida en el paso anterior):

```plaintext
<ruta_del_sdk>\cmdline-tools\latest\bin
C:\Users\adiaz\AppData\Local\Android\Sdk\cmdline-tools\latest\bin
<ruta_del_sdk>\platform-tools
C:\Users\adiaz\AppData\Local\Android\Sdk\platform-tools
Verificar las herramientas existentes: Abre una terminal (PowerShell o CMD) y ejecuta:
```

Si no tiene cmdline-tools lo instala de https://developer.android.com/studio?hl=es-419#command-line-tools-only está en la parte de abajo. Se descomprime el archivo descargdo y se copia en la ruta.

```bash
sdkmanager --list

```
Esto te mostrará las herramientas y plataformas instaladas. Si tiene error entonces Asegurarte de que Java está instalado. El SDK Manager requiere Java. Asegúrate de que tienes una versión de Java instalada en tu sistema. Se recomienda Java Development Kit (JDK), preferiblemente la versión 11 o superior.
Descarga e instala Java JDK desde Oracle o AdoptOpenJDK.

```bash
sdkmanager --list
```
Si falta alguna herramienta o versión, puedes instalarla con:

```bash
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
```

Evitar instalar las herramientas ya configuradas en Android Studio: Si ya tienes configurado lo siguiente desde Android Studio, no necesitas repetirlo:

Google Play Intel x86_64 Atom System Image.
Android SDK Platform.
Android Emulator.
Platform-tools.

Verificar adb (Android Debug Bridge): Después de configurar las variables de entorno, verifica que el comando adb funciona:

```bash

adb version
```

Esto debería mostrar la versión de adb instalada.

Conectar tu dispositivo físico:

Habilita Depuración por USB en tu dispositivo:
Ve a Configuración > Acerca del teléfono.
Toca varias veces en "Número de compilación" para habilitar el modo desarrollador.
Ve a Opciones de desarrollador y activa Depuración USB.
Conecta tu dispositivo a tu computadora con un cable USB.
Ejecuta:

```bash

adb devices
```

Esto debería listar tu dispositivo.



# 4. Crear el Proyecto React Native
Crea un nuevo proyecto:

```bash
npx react-native init PrediccionCompra
cd PrediccionCompra
```

Abre el proyecto en Visual Studio Code:

```bash

code .
```
Instala Axios para manejar solicitudes HTTP:

```bash

npm install axios
```
# 5. Configurar la Interfaz de Usuario

En el archivo App.js, usa el siguiente código para capturar la IP y puerto del servidor, tomar una foto desde el dispositivo y enviarla al backend:
```javascript

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const App = () => {
  const [ip, setIp] = useState('');
  const [puerto, setPuerto] = useState('');
  const [imagen, setImagen] = useState(null);

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (permiso.granted) {
      const resultado = await ImagePicker.launchCameraAsync();

      if (!resultado.cancelled) {
        setImagen(resultado.uri);
      }
    } else {
      Alert.alert('Permiso denegado', 'Necesitas habilitar el permiso para la cámara.');
    }
  };

  const enviarImagen = async () => {
    if (!ip || !puerto) {
      Alert.alert('Error', 'Por favor ingresa la IP y el puerto del servidor.');
      return;
    }

    if (!imagen) {
      Alert.alert('Error', 'Por favor toma una foto antes de enviarla.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: imagen,
      type: 'image/jpeg',
      name: 'foto.jpg',
    });

    try {
      const response = await axios.post(`http://${ip}:${puerto}/predict/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Respuesta del servidor', JSON.stringify(response.data));
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la imagen: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conexión al servidor</Text>
      <TextInput
        style={styles.input}
        placeholder="IP del servidor"
        value={ip}
        onChangeText={setIp}
      />
      <TextInput
        style={styles.input}
        placeholder="Puerto del servidor"
        value={puerto}
        onChangeText={setPuerto}
      />
      <Button title="Tomar Foto" onPress={tomarFoto} />
      <Button title="Enviar Imagen" onPress={enviarImagen} />
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
});

export default App;
```


# 6. Ejecutar el Proyecto en un Dispositivo Físico
Conecta tu dispositivo Android al PC usando un cable USB.
Ejecuta el proyecto en tu dispositivo:
```bash
npx react-native run-android
```

Tu app debería abrirse en el dispositivo físico.

**Opcional:** Probar con Emulador sin Android Studio

Usa Genymotion como alternativa al emulador de Android Studio:

Descarga e instala Genymotion: https://www.genymotion.com/.
Configura Genymotion con una imagen de Android.
Asegúrate de que adb detecte el emulador:
```bash
adb devices

# 7. Desplegar la API y App

Asegúrate de que tu API esté accesible desde tu dispositivo físico configurando el puerto y habilitando acceso público en tu servidor.
