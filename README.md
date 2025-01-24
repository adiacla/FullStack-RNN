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
# 4. Desarrollo del Frontend en Android Studio

Pasos para Configurar el Proyecto en Android Studio

## Crear un Proyecto Nuevo:
Abre Android Studio y crea un nuevo proyecto con una actividad vacía.
Usa Kotlin como lenguaje de programación. 
Probado en API 28 Andorio 9+ Java 17

## Actualizar dependencias de Gradle
Abre el archivo build.gradle de tu aplicación (ubicado en /app) y asegúrate de agregar estas dependencias para Jetpack Compose, la biblioteca de cámaras y la librería de red Retrofit:

```
dependencies {
    // Jetpack Compose
    implementation "androidx.compose.ui:ui:1.3.1"
    implementation "androidx.compose.material3:material3:1.0.1"
    implementation "androidx.activity:activity-compose:1.6.1"
    implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.5.1"

    // CameraX para capturar imágenes
    implementation "androidx.camera:camera-core:1.2.0"
    implementation "androidx.camera:camera-lifecycle:1.2.0"
    implementation "androidx.camera:camera-view:1.2.0"

    // Retrofit para la comunicación HTTP con el servidor
    implementation "com.squareup.retrofit2:retrofit:2.9.0"
    implementation "com.squareup.retrofit2:converter-gson:2.9.0"
}
```
Después de realizar estos cambios, sincroniza tu proyecto en Android Studio.

## Crear un cliente HTTP para Retrofit
Crea una clase llamada ApiService.kt en la carpeta app/kotlin/com/example/unab2/ para gestionar la conexión con el servidor.

```
package com.example.unab2

import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface ApiService {
    @Multipart
    @POST("predict/")
    suspend fun predict(@Part file: MultipartBody.Part): PredictionResponse

    data class PredictionResponse(
        val predictions: List<Prediction>
    )

    data class Prediction(
        val class_id: String,
        val class_name: String,
        val probability: Float
    )
}

object ApiClient {
    private const val BASE_URL = "http://ec2-52-90-150-200.compute-1.amazonaws.com:8080/"

    val instance: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(OkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
```

### 3. Configurar la captura de imágenes con CameraX
En tu archivo MainActivity.kt, configura CameraX para capturar imágenes. Cambia el contenido del archivo como sigue:

package com.example.unab2

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.example.unab2.ui.theme.Unab2Theme
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class MainActivity : ComponentActivity() {
    private lateinit var imageCapture: ImageCapture
    private lateinit var cameraExecutor: ExecutorService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        cameraExecutor = Executors.newSingleThreadExecutor()

        setContent {
            Unab2Theme {
                Scaffold {
                    CameraScreen(onCapture = { file ->
                        uploadImage(file)
                    })
                }
            }
        }

        requestCameraPermission()
    }

    private fun requestCameraPermission() {
        val permission = Manifest.permission.CAMERA
        if (ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED) {
            setupCamera()
        } else {
            requestPermissions(arrayOf(permission), 0)
        }
    }

    private fun setupCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraProviderFuture.addListener({
            val cameraProvider = cameraProviderFuture.get()
            val cameraSelector = androidx.camera.core.CameraSelector.DEFAULT_BACK_CAMERA
            imageCapture = ImageCapture.Builder().build()

            val preview = androidx.camera.core.Preview.Builder().build().apply {
                setSurfaceProvider(findViewById(androidx.camera.view.PreviewView(this@MainActivity)).surfaceProvider)
            }

            cameraProvider.unbindAll()
            cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageCapture)
        }, ContextCompat.getMainExecutor(this))
    }

    private fun uploadImage(file: File) {
        lifecycleScope.launch {
            try {
                val requestBody = RequestBody.create("image/jpeg".toMediaTypeOrNull(), file)
                val multipartBody = MultipartBody.Part.createFormData("file", file.name, requestBody)
                val response = ApiClient.instance.predict(multipartBody)

                Toast.makeText(this@MainActivity, "Predicción: ${response.predictions[0].class_name}", Toast.LENGTH_LONG).show()
            } catch (e: Exception) {
                Log.e("MainActivity", "Error en la predicción", e)
            }
        }
    }
}
```
## 4. Crear la pantalla de la cámara (Jetpack Compose)
Agrega el siguiente componente para la pantalla de la cámara en tu archivo MainActivity.kt:

```
@Composable
fun CameraScreen(onCapture: (File) -> Unit) {
    val context = LocalContext.current
    val photoFile = File(context.externalCacheDir, "captured_image.jpg")

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
    ) {
        androidx.camera.view.PreviewView(context).apply {
            modifier = Modifier.weight(1f)
        }
        Button(onClick = {
            try {
                val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()
                imageCapture.takePicture(
                    outputOptions,
                    ContextCompat.getMainExecutor(context),
                    object : ImageCapture.OnImageSavedCallback {
                        override fun onError(exception: ImageCaptureException) {
                            Log.e("CameraScreen", "Error al capturar imagen", exception)
                        }

                        override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                            onCapture(photoFile)
                        }
                    }
                )
            } catch (e: Exception) {
                Log.e("CameraScreen", "Error en la captura", e)
            }
        }) {
            Text("Capturar y Predecir")
        }
    }
}
```
## 5. Probar la app
Conecta un dispositivo físico o emulador que soporte CameraX.
Ejecuta la app en Android Studio.
Toma una foto y envíala al servidor.
Verifica que las predicciones se muestren como un Toast.

