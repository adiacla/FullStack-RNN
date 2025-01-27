# Ejercicio de BackEnd y FrontEnd 

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
pip install fastapi uvicorn keras 

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
# 2. Frontend en React Native: React Native en Windows 11


Node.js y npm:

Verifica la instalación de Node.js y npm ejecutando en la terminal:
bash
Copiar
node -v
npm -v
Si no ves la versión de Node.js (al menos v18.x.x) o npm (v10.x.x), descarga e instala la versión LTS de Node.js desde aquí.
Java Development Kit (JDK):

Tienes que tener instalado JDK 17, como mencionaste.
Verifica la instalación del JDK ejecutando en la terminal:
bash
Copiar
java -version
javac -version
Si no tienes el JDK correctamente instalado, puedes descargarlo desde AdoptOpenJDK o desde el sitio de Oracle.
Android Studio:

Verifica la instalación de Android Studio. Abre Android Studio y asegúrate de que el Android SDK y el Android Virtual Device (AVD) estén correctamente instalados.

Dentro de Android Studio, ve a SDK Manager y asegúrate de que estén instaladas las siguientes herramientas:

Android SDK Platform 35.
Intel x86 Atom System Image o Google APIs Intel x86 Atom System Image.
Android SDK Build Tools 35.0.0.
Si no tienes el AVD (Android Virtual Device), crea uno. Si tienes un dispositivo físico Android, puedes usarlo directamente conectándolo al PC a través de USB y habilitando la depuración USB en tu dispositivo.

Variables de Entorno: Verifica que las variables de entorno estén correctamente configuradas:

ANDROID_HOME debe apuntar a la carpeta de instalación del SDK de Android. Por ejemplo:
plaintext
Copiar
%LOCALAPPDATA%\Android\Sdk
Asegúrate de que la ruta a platform-tools esté en el PATH. Deberías añadir algo como:
plaintext
Copiar
%LOCALAPPDATA%\Android\Sdk\platform-tools
Paso 2: Limpiar posibles residuos de instalaciones previas
Si has tenido problemas con instalaciones previas, es recomendable limpiar completamente las dependencias globales de npm y React Native.

Eliminar React Native CLI globalmente: Si tienes instalado react-native-cli globalmente, elimínalo:

bash
Copiar
npm uninstall -g react-native-cli
Eliminar la caché de npm: Borra la caché de npm para evitar problemas con dependencias:

bash
Copiar
npm cache clean --force
Reinstalar React Native CLI: Ahora, instala React Native CLI nuevamente, pero solo si es necesario. La recomendación es usar npx para inicializar el proyecto sin necesidad de instalarlo globalmente:

bash
Copiar
npm install -g @react-native-community/cli
Paso 3: Crear el Proyecto de React Native
Una vez que todo esté instalado y configurado correctamente, crea un nuevo proyecto de React Native con el siguiente comando:


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



# 2.4. Crear el Proyecto React Native
Crea un nuevo proyecto:

```bash
 npx @react-native-community/cli init imagen
cd PrediccionCompra
```
npm uninstall -g react-native-cli

Abre el proyecto en Visual Studio Code:

```bash

code .
```
Instalar dependencias necesarias: Después de agregar el archivo App.js, asegúrate de que las dependencias que usas, como axios para HTTP y expo-image-picker, estén instaladas.

Ejecuta estos comandos en tu terminal dentro del directorio de tu proyecto:

```bash
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
## 2.5 Permisos en AndroidManifest.xml
Asegúrate de que los permisos para la cámara estén configurados en tu archivo AndroidManifest.xml:

```xml

<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

```

2.6 Ejecutar la App en el Emulador o en un Dispositivo Físico

Conectar un dispositivo Android físico y habilitar la Depuración USB en las Opciones de Desarrollador.

Ejecutar el Proyecto en un Dispositivo Físico:

```bash

npx react-native run-android
```
Emulador de Android: Si prefieres usar un emulador, puedes instalar Genymotion como alternativa al emulador de Android Studio:

Descargar Genymotion.
Configura el emulador con una imagen de Android y asegúrate de que adb detecte el emulador:
```bash
adb devices

```
---

# 3. Despliegue Final
## 3.1 Revisar Configuración de Seguridad en AWS
Asegúrate de que el grupo de seguridad en AWS permita el tráfico en el puerto 8080 y que tu servidor sea accesible desde fuera de la red privada.

## 3.2 Generar la App para Producción
Si todo funciona correctamente, puedes generar la versión de producción de la app:

```bash
npx react-native run-android --variant=release
```
