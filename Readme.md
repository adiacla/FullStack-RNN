# Ejercicio de BackEnd y FrontEnd 

## Objetivo
Desarrollar una aplicación móvil para Android que capture una foto, la envíe a un servidor backend en AWS EC2 mediante una API REST, procese la imagen usando el modelo preentrenado VGG16 para clasificar el objeto en la imagen y muestre la predicción en la aplicación móvil.

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Screenshot_2025-01-28-17-35-27-25_a76c364ee29521e4906812fb8cfe2a52.jpg?raw=true)

## Estructura del Taller
### Requisitos del Proyecto

1. Configuración del Backend en Ubuntu (AWS EC2)
2. Desarrollo del API con Flask o FastAPI
3. Desarrollo del Frontend en VsC con React Naive
4. Pruebas de Integración

### Backend (FastAPI)
- **AWS EC2** con Ubuntu
- **FastAPI** para el backend
- **Modelo de Red Neuronal de reconocimiento de imagenes**

### Frontend (React Native)
- **Windows 11** para el desarrollo
- **React Native** CLI
- **Axios** para hacer solicitudes HTTP

---

## 1. **Backend - FastAPI en AWS EC2**

### 1.1 **Configurar la Instancia EC2 en AWS**

1. En la consola de administración de AWS seleccione el servicio de EC2 (servidor virtual) o escriba en buscar.
![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraEC2.JPG?raw=true)

2. Ve a la opción para lanzar la instancia

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irainstancias.JPG?raw=true)

3. Lanza una istancia nueva

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iralanzarinstancia.JPG?raw=true)

4. Inicia una nueva **instancia EC2** en AWS (elige Ubuntu como sistema operativo), puede dejar la imagen por defecto. 

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Instancia%20Ubuntu.PNG?raw=true)

5. Para este proyecto dado que el tamaño del modelo a descargar es grande necesitamos una maquina con más memoria y disco.
   con nuesra licencia tenemos permiso desde un micro lanzar hasta un T2.Large. 


![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iratipodeinstancia.JPG?raw=true)


6. seleccione el par de claves ya creado, o cree uno nuevo (Uno de los dos, pero recuerde guardar esa llave que la puede necesitar, no la pierda)

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraparclaves.JPG?raw=true)

7. Habilite los puertos de shh, web y https, para este proyecto no lo vamos a usar no es necesario, pero si vas a publicar una web es requerido.
   ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irfirewall.JPG?raw=true)

8. Configure el almacenamiento. Este proyecto como se dijo requere capacidad en disco. Aumente el disco a 16 GiB.

   ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraconfiguraralmacenamiento.JPG?raw=true)

9. Finalmente lance la instancia (no debe presentar error, si tiene error debe iniciar de nuevo). Si todo sale bien, por favor haga click en instancias en la parte superior.

   ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/lanzarinstanciafinal.PNG?raw=true)


10. Dado que normalmente en la lista de instancias NO VE la nueva instancia lanzada por favor actualice la pagina Web o en ir a instancias
    
 ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iracutualizarweb.JPG?raw=true)
![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irainstancias.JPG?raw=true)

11. Vamos a seleccionar el servidor ec2 lanzado.
    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irseleccionarinstancia.JPG?raw=true)

12. Verificar la dirección IP pública y el DNS en el resumen de la instancia
    
![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irresumeninstancia.JPG?raw=true)

13. Debido a que vamos a lanzar un API rest debemos habilitar el puerto. Vamos al seguridad

    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraseguirdad.JPG?raw=true)

14. Vamos al grupo de seguridad

   ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iragruposeguridad.JPG?raw=true)

   15. Vamos a ir a Editar la regla de entrada

       ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraregladeentrada.JPG?raw=true)

16. Ahora vamos a agregar un regla de entrada para habilitar el puerto, recuerden poner IPV 4

    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iragregarregla.JPG?raw=true)

     


17. Abre un puerto en el grupo de seguridad (por ejemplo, puerto **8080**) para permitir acceso a la API.

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Puerto.PNG?raw=true)

18. Guardemos la regla de entrada.
    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irguardarreglas.JPG?raw=true)

19. Ve nuevamente a instancias
    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iralanzarinstanciaB.JPG?raw=true)

20. Vamos a conectar con la consola del servidor
    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irconectar.JPG?raw=true)

    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irconsola.JPG?raw=true)
    
3. Si no puedes conectarse directamente a la instancia EC2, conectate  con SSH, es decir en la consola de administración de instancia creada hay una opcion de "Conectar", has clic y luego conectar otra vez. Si no puede conectarse puede hacerlo con el SSH:
   

   ```bash
   ssh -i "tu_clave.pem" ubuntu@<tu_ip_ec2>

---

### 1.2 Instalar Dependencias en el Servidor EC2
Una vez dentro de tu instancia EC2, instalar las librerias y complementos como FastAPI y las dependencias necesarias para ello debes crear una carpeta en donde realizaras las instalaciones:

**Ver las carpetas**
 ```bash
ls -la
 ```
**Ver la version de python**
 ```bash
python3 -V
 ```

**Si se requiere, puede actualizar los paquetes**
 ```bash
sudo apt update
 ```
![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/aptUpdate.PNG?raw=true)


**Si se requiere: Instalar pip y virtualenv**
 ```bash
sudo apt install python3-pip python3-venv
 ```

**Crear la carpeta del proyecto**
 ```bash
mkdir proyecto
 ```

**Accede a tu carpeta**
 ```bash
cd proyecto
 ```

**Crear y activar un entorno virtual**
 ```bash

python3 -m venv venv
source venv/bin/activate
 ```
Recuerda que en el prompt debe obersar que el env debe quedar activo

**Instalar FastAPI, Uvicorn, Joblib, TensorFlow, Python-Multipart, Pillow**
 ```bash
pip install fastapi uvicorn keras

 ```
```bash
pip install tensorflow

 ```
```bash
pip install python-multipart

 ```
```bash
pip install pillow

 ```

### 1.3 Crear la API FastAPI

Crea un archivo app.py en tu instancia EC2 para definir la API que servirá las predicciones.

 ```bash
nano app.py
 ```

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/nanoApp.PNG?raw=true)


Desarrollo del Backend API
Usaremos FastAPI por su rendimiento y facilidad de uso. El backend aceptará una imagen, la procesará con el modelo VGG16 y devolverá la predicción.
Puede copiar este codigo en tu editor de nano.

 ```python
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from keras.applications.vgg16 import VGG16, preprocess_input, decode_predictions
from keras.utils import img_to_array, load_img
import numpy as np
import uvicorn
import json

app = FastAPI()

# Cargar el modelo VGG16
model = VGG16(weights="imagenet")

# Cargar las traducciones desde el archivo
def load_translations(file_path="traduccion.txt"):
    try:
        with open(file_path, "r") as f:
            translations = json.load(f)
        return translations
    except Exception as e:
        print(f"Error loading translations: {str(e)}")
        return {}

translations = load_translations("traduccion.txt")

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

        # Formatear las predicciones con las traducciones en español
        results = []
        for pred in decoded_predictions:
            class_id = pred[0]
            class_name = translations.get(class_id, pred[1])  # Si no se encuentra, usamos el nombre en inglés
            probability = float(pred[2])
            results.append({"class_id": class_id, "class_name": class_name, "probability": probability})

        return JSONResponse(content={"predictions": results})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8720)

```

Para salir del editor **nano** oprime CTRL-X y luego (Save modified buffer? ) escribe "Y" y (Save modified buffer? app.py) ENTER.
puede verificar que archivo fue creado

 ```bash
ls -la
 ```
o puedes ver si en el archivo quedó el codigo guardado

 ```bash
cat app.py
 ```

### 1.4 Crear el Diccionario
Dado que las clases con que fué entrenado nuestro modelo es en inglés, en el GitHub hay un archivo con un diccionario para covertir la respuesta a españo. Para que nuestra app.py funcione es necesario crear un diccionario para hacer la traduccion al español, crea el siguiente archivo con este nombre

 ```bash
nano traduccion.txt
 ```

Una vez creado el archivo copia y pega el diccionario.txt encontrado en este github.
Tambien puedes descargarlo directamente accediendo al archivo del diccionario, darle click en raw y copiar la URL que te sale, luego ve a tu carpeta donde tienes el proyecto y ejecuta el siguiente comando


 ```bash
wget https://raw.githubusercontent.com/adiacla/FullStack-RNN/refs/heads/main/traduccion.txt
 ```


### 1.5 Ejecutar el Servidor FastAPI

Para ejecutar el servidor de FastAPI, usa Uvicorn:

 ```bash
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8080 --reload
 ```

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/ServidorAws.PNG?raw=true)

### 1.6 Error en el Servidor

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Error.PNG?raw=true)

Si al momento de ejecutar el servidor te da un error como en el de la anterior imagen en el cual se excede la memoria del sistema utiliza el siguiente comando y vuelve a intentarlo

```bash
sudo sync; sudo sysctl -w vm.drop_caches=3
 ```

## Pueba del Backend
Puedes usar la prueba manual

Prueba manual:

Usa herramientas como Postman o cURL para probar la API antes de integrarla con el frontend. Ejemplo de prueba con cURL:

curl -X POST -F "file=@image.jpg" http://ec2-54-164-41-174.compute-1.amazonaws.com:8080/predict/
Espera un JSON como respuesta con las predicciones.

Si vas a utilizar postman entra en el siguiente enlance https://www.postman.com , crea o ingresa a tu cuenta y sigue los siguientes pasos:
1. Dale click en new request

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/NewRequest.PNG?raw=true)
   
2. Poner las siguientes opciones en la request

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/PostRequest.PNG?raw=true)
   
Recuerda que debes poner la URL de tu EC2 acompañado con el :8080 que es el puerto y con el /predict que es el endpoint que queremos probar.

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/postman.PNG?raw=true)

La API estará disponible en http://<tu_ip_ec2>:8080.


# 2. Frontend en React Native: React Native en Windows 11


Node.js y npm:

## Paso 1: Verifica la instalación de Node.js y npm ejecutando en la terminal:
 ```bash

node -v
npm -v
 ```

Si no ves la versión de Node.js (al menos v18.x.x) o npm (v10.x.x), descarga e instala la versión LTS de Node.js desde aquí.

https://reactnative.dev/docs/set-up-your-environment

Va a requerir primero bajar 

https://chocolatey.org/install

Todos los pasos los puede verificar aqui

 https://youtu.be/nwXUXt_QqU8?si=dWjeavfLB06cz-bo


Verifica la instalación de Android Studio. Abre Android Studio y asegúrate de que el Android SDK y el Android Virtual Device (AVD) estén correctamente instalados, en el siguiente link puedes realizar la descarga.

https://developer.android.com/studio?hl=es-419&_gl=1*5t55h4*_up*MQ..&gclid=EAIaIQobChMIie2A3uCYiwMVJ7VaBR2njTbJEAAYASAAEgIdWvD_BwE&gclsrc=aw.ds

Dentro de Android Studio, ve a SDK Manager y asegúrate de que estén instaladas las siguientes herramientas:

Android SDK Platform 35.

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/SDK35.PNG?raw=true)

Intel x86 Atom System Image o Google APIs Intel x86 Atom System Image. (depende el procesador de tu maquina)

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Intelx86.PNG?raw=true)

Android SDK Build Tools 35.0.0.

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/BuildTools.PNG?raw=true)

Si no tienes el AVD (Android Virtual Device), crea uno. Si tienes un dispositivo físico Android, puedes usarlo directamente conectándolo al PC a través de USB y habilitando la depuración USB en tu dispositivo.

Si no tienes el command-line tools, entra a la pagina de Android Studio 
https://developer.android.com/studio?gad_source=1&gclid=EAIaIQobChMIie2A3uCYiwMVJ7VaBR2njTbJEAAYASAAEgIdWvD_BwE&gclsrc=aw.ds&hl=es-419

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/comandTools.PNG?raw=true)

Una vez tienes el command-line tools debes extraerlo en el Android/SDK C:\Users\Smartcenter\AppData\Local\Android\Sdk

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/cmdline-tools.PNG?raw=true)

## Verficiación del NDK
* Abre Android Studio

Ve a: More Actions > SDK Manager

Haz clic en la pestaña SDK Tools

Marca la opción NDK (Side by side)

Si ya está marcada:

Desmárcala

Aplica cambios (esto desinstala)

* Luego vuelve a marcarla y aplica de nuevo (esto reinstala correctamente)

Asegúrate también de tener marcado:

CMake

Android SDK Command-line Tools (latest)

Reinicia Android Studio y tu terminal (cmd o Node.js Prompt)


## Variables de Entorno de Usuario:
Verifica que las variables de entorno estén correctamente configuradas, para ello accede a las variables de entorno desde el buscador de windows:

![image](https://github.com/user-attachments/assets/de660b10-e806-4229-af0f-a3a068cb5868)

Una vez estes ahi, dale click en variables de entorno

![image](https://github.com/user-attachments/assets/70aea713-c754-43e6-918a-938b5d81c4c5)

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/android_Home.PNG?raw=true)


ANDROID_HOME debe apuntar a la carpeta de instalación del SDK de Android, el path de su cuenta o del sistema configure: Por ejemplo:
 ```plaintext

%LOCALAPPDATA%\Android\Sdk
%ANDROID_HOME%\tools\bin
%ANDROID_HOME%\emulator
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
 ```

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/android_Home.PNG?raw=true)

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/sdk_entorno.PNG?raw=true)


##Asegúrate de que el emulador esté iniciado ANTES de correr run-android

Revisa que el dispositivo tenga una imagen compatible (por ejemplo, API 30 o superior)

Usa el emulador Pixel API 33 x86_64 (recomendado)


## Paso 2: Limpiar posibles residuos de instalaciones previas
Si has tenido problemas con instalaciones previas, es recomendable limpiar completamente las dependencias globales de npm y React Native.

Eliminar React Native CLI globalmente: Si tienes instalado react-native-cli globalmente, elimínalo:

 ```bash

npm uninstall -g react-native-cli
 ```
Eliminar la caché de npm: Borra la caché de npm para evitar problemas con dependencias:

 ```bash

npm cache clean --force
 ```

## Paso 3: Crear el Proyecto de React Native
Una vez que todo esté instalado y configurado correctamente, crea un nuevo proyecto de React Native con el siguiente comando:

Ejecutar directamente en Node.js Command Prompt en Administrador,
si prefieres no modificar las políticas de PowerShell, puedes usar el terminal proporcionado por Node.js:

Abre Node.js Command Prompt (generalmente instalado junto con Node.js).
Ejecuta tu comando:
 ```bash
npx @react-native-community/cli init imagenes
 ```
 (imagenes es el nombre del proyecto)


![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/React.PNG?raw=true)


Conectar tu dispositivo físico:
En adroide puedes configurar un    dispositivo virtual

En fisico:

Habilita Depuración por USB en tu dispositivo:
Ve a Configuración > Acerca del teléfono.
Toca varias veces en "Número de compilación" para habilitar el modo desarrollador.
Ve a Opciones de desarrollador y activa Depuración USB.
Conecta tu dispositivo a tu computadora con un cable USB.

Esto debería listar tu dispositivo.

Si no te llega a funcionar de este metodo, busca en google el modelo de tu celular y como activar el modo desarrollador

Accede a la carpeta de tu proyecto:

```bash
cd imagenes
```

Luego realiza una limpieza del cache:
```bash
npm cache clean --force
```

Ahora ejecuta el siguiente comando y veras la plantilla base de React Native
```bash
npx react-native run-android
```

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/plantilla.PNG?raw=true)

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Screenshot_2025-01-28-15-47-27-28_be78f1e3c60d0ba7def362c0a150a54c.jpg?raw=true)


## Paso 4: Instalar dependencias necesarias: 
Después de agregar el archivo App.js, asegúrate de que las dependencias que usas, como axios para HTTP y expo-image-picker, estén instaladas.
Instalaciones Requeridas: Asegúrate de haber instalado las dependencias necesarias:

```bash
npm install axios
```
```bash
npm install --save expo-image-picker
```
```bash
npm install react-native-permissions
```
```bash
npm install react-native-image-picker
```
```bash
npm install react-native-tts
```

## Paso 5: Crea el archivo app.tsx 
Cambia el archivo app.tsx y ejecuta estos comandos en el Visual Studio Code dentro del directorio de tu proyecto:

```bash
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Platform, Image } from 'react-native';
import axios from 'axios';
import { launchCamera } from 'react-native-image-picker';
import { PermissionsAndroid, Platform as RNPlatform } from 'react-native'; 
import Tts from 'react-native-tts'; // Importa el paquete de texto a voz

const App = () => {
  const [ip, setIp] = useState('');
  const [puerto, setPuerto] = useState('');
  const [imagen, setImagen] = useState(null);
  const [respuesta, setRespuesta] = useState(null);

  // Función para solicitar permisos en Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso para usar la cámara',
            message: 'La aplicación necesita acceso a la cámara para tomar fotos.',
            buttonNeutral: 'Pregúntame después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          },
        );

        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permiso para usar el almacenamiento',
            message: 'La aplicación necesita acceso al almacenamiento para guardar las fotos.',
            buttonNeutral: 'Pregúntame después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          },
        );

        if (cameraPermission === PermissionsAndroid.RESULTS.GRANTED && storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permisos concedidos');
        } else {
          console.log('Permisos denegados');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Función para pedir permisos en iOS (si es necesario)
  const checkPermissionsForiOS = async () => {
    if (Platform.OS === 'ios') {
      const result = await launchCamera({ mediaType: 'photo' });
      if (result.errorCode) {
        Alert.alert('Error', 'No se pudieron obtener permisos para la cámara.');
      }
    }
  };

  // Llamar las funciones de permisos al inicio
  useEffect(() => {
    requestPermissions();
    checkPermissionsForiOS();
    Tts.setDefaultLanguage('es-ES'); 
    Tts.setDefaultRate(0.5); 
  }, []);

  const tomarFoto = async () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.5,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('Usuario canceló la cámara');
      } else if (response.errorCode) {
        console.log('Error en la cámara: ', response.errorMessage);
      } else {
        const { uri } = response.assets[0];  // Usamos `assets[0]` ya que launchCamera retorna una matriz
        setImagen(uri);
      }
    });
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
      setRespuesta(response.data.predictions);
      // Convertir la respuesta a voz
      speakResponse(response.data.predictions);
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la imagen: ' + error.message);
    }
  };

  // Función para convertir la respuesta a voz
  const speakResponse = (predictions) => {
    if (predictions && predictions.length > 0) {
      const speechText = predictions.map(item => {
        return `La imagen se clasifica como ${item.class_name} con una probabilidad de ${(item.probability * 100).toFixed(2)}%.`;
      }).join(' '); // Unir todas las predicciones en un solo texto
      Tts.speak(speechText); // Convertir el texto a voz
    }
  };

  return (
    

    <View style={styles.container}>

      
      <View style={styles.header}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Reconocimiento de Imagenes</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="IP del servidor"
        value={ip}
        onChangeText={setIp}
        placeholderTextColor="white"
      />
      <TextInput
        style={styles.input}
        placeholder="Puerto del servidor"
        value={puerto}
        onChangeText={setPuerto}
        placeholderTextColor="white"
      />
      <Button title="Tomar Foto" onPress={tomarFoto} />
      <Button title="Clasificar Imagen" onPress={enviarImagen} />

      {respuesta && (
        <ScrollView style={styles.responseContainer}>
          <Text style={styles.responseTitle}>La imagen se puede clasificar en:</Text>
          {respuesta.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>Class Name: {item.class_name}</Text>
              <Text style={styles.tableCell}>Probability: {(item.probability * 100).toFixed(2)}%</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 1,
    marginBottom:20,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
    flexWrap: 'wrap',  
    lineHeight: 30,    
    width: '80%',      
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: 'black',
    color: 'white',
  },
  responseContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  responseTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    marginBottom: 10,
  },
  tableCell: {
    fontSize: 16,
    color: 'black',
  },
});

export default App;

```
## Paso 6: Permisos en AndroidManifest.xml
Asegúrate de que los permisos para la cámara estén configurados en tu archivo AndroidManifest.xml: en C:\Users\USUARIO\imagenes\android\app\src\main\AndroidManifest.xml

```xml

<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_MEDIA_LOCATION"/>


```

## Paso 7: Crea la carpeta assets
En la raíz del proyecto crea una carpeta llamada assets en donde pongas la imagen del logo utilizada en el proyecto que podrás encontrar en los recursos de este github

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Assets.PNG?raw=true)

## Paso 8: Ejecutar la App en el Emulador o en un Dispositivo Físico

Conectar un dispositivo Android físico y habilitar la Depuración USB en las Opciones de Desarrollador.

Puede listar si el dispoitivo está conectado
adb devices

listar los emuladores
emulator -list-avds



cd android
gradlew clean
cd ..

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

# Si no funciona el despliegue de esa manera siga los siguientes pasos

## Generando una clave
Necesitará una clave de firma generada por Java, que es un archivo de almacén de claves que se utiliza para generar un binario ejecutable React Native para Android. Puede crear uno usando la herramienta de teclas en la terminal con el siguiente comando
En Windows keytool debe ejecutarse desde C:\Program Files\Java\jdkx.x.x_x\bin, como administrador.

```bash
keytool -genkey -v -keystore your_key_name.keystore -alias your_key_alias -keyalg RSA -keysize 2048 -validity 10000
```

Este comando le solicita las contraseñas para el almacén de claves y la clave, así como los campos de nombre distintivo de su clave. Luego, genera el almacén de claves como un archivo llamado my-upload-key.keystore.

El almacén de claves contiene una clave única, válida durante 10 000 días. El alias es un nombre que utilizará más adelante al firmar su aplicación, así que recuerde tomar nota del alias.

## Configuración de variables

1. Coloque el my-upload-key.keystorearchivo en el android/appdirectorio en la carpeta de su proyecto.
   
2. Edite el archivo ~/.gradle/gradle.propertieso android/gradle.properties, y agregue lo siguiente (reemplace *****con la contraseña del almacén de claves, el alias y la contraseña de clave correctos)

```bash
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

Estas serán variables globales de Gradle, que luego podremos usar en nuestra configuración de Gradle para firmar nuestra aplicación.

## Cómo agregar una configuración de firma a la configuracion

El último paso de configuración que se debe realizar es configurar las compilaciones de lanzamiento para que se firmen mediante la clave de carga. Edite el archivo android/app/build.gradleen la carpeta de su proyecto y agregue la configuración de firma.

```bash
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

## Generando la liberación 
Ejecute el siguiente comando en una terminal:

```bash
npx react-native build-android --mode=release

```

Este comando utiliza bundleReleaseel componente interno de Gradle que agrupa todo el JavaScript necesario para ejecutar su aplicación en el AAB ( Android App Bundle ). Si necesita cambiar la forma en que se agrupan el paquete de JavaScript o los recursos dibujables (por ejemplo, si cambió los nombres de archivo/carpeta predeterminados o la estructura general del proyecto), consulte para android/app/build.gradlever cómo puede actualizarlo para reflejar estos cambios.


## Probar la versión de lanzamiento de su aplicación

```bash
npm run android -- --mode="release"
```

## Si tiene algun error al correr la aplicacion

El error principal está relacionado con el plugin com.facebook.react.settings en el archivo settings.gradle, y la incapacidad de Gradle para mover archivos temporales en la carpeta .gradle.

Soluciones Posibles
1. Limpiar el Caché de Gradle
A veces, el problema ocurre debido a un caché corrupto. Limpia los archivos temporales de Gradle:
Abre una terminal y ejecuta:

```bash
cd android
gradlew clean
```
Si el comando falla, ejecuta:

``` bash
./gradlew clean
```
Borra manualmente la carpeta .gradle:

Navega a C:\Users\USUARIO\imagenes\android\.
Borra la carpeta .gradle.
Intenta compilar nuevamente:

```bash
npx react-native run-android
```
