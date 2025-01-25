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

Herramientas y Entornos Necesarios
> Backend con FastAPI
> 
Revisión del código del backend, modelo VGG16, dependencias, y ejecución en EC2.

> Configuración del proyecto Android (Gradle y dependencias)
> 
Validar las configuraciones de build.gradle y libs.versions.toml para incluir Retrofit, CameraX y otras dependencias correctamente.

>  Integración de CameraX
> 
Verificar la configuración de CameraX, la solicitud de permisos y la captura de imágenes.

> Comunicación con el backend
> 
Analizar la implementación de Retrofit y cómo se gestiona la llamada al servidor y el manejo de errores.

> Pantalla con Jetpack Compose
> 
Revisar la implementación de la interfaz de usuario (Jetpack Compose), su diseño y funcionalidad.

> Pruebas finales y posibles problemas
> 
Identificar problemas potenciales al conectar el frontend con el backend y posibles errores comunes.



# Servidor Backend:
AWS EC2 con Ubuntu 24.04 LTS.
Python 3.10+.
Flask o FastAPI.
Puertos abiertos en el EC2 para permitir tráfico en el puerto 8080.

# Frontend:

## Android Studio.

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
```python
sudo apt update
sudo apt install python3-pip python3-venv -y
python3 -m venv venv
source venv/bin/activate
pip install flask fastapi uvicorn[standard] keras tensorflow pillow numpy
pip install python-multipart
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

Use
>nano proyecto.py
>digite el codigo del backend en EC2

### Pueba del Backend
Puedes usar la prueba manual

Prueba manual:

Usa herramientas como Postman o cURL para probar la API antes de integrarla con el frontend.
Ejemplo de prueba con cURL:

```bash
curl -X POST -F "file=@image.jpg" http://ec2-54-164-41-174.compute-1.amazonaws.com:8080/predict/
```
Espera un JSON como respuesta con las predicciones.


## Ejecución en EC2:

Al copiar el código a tu instancia de EC2, guárdalo como app.py o main.py para simplificar su ejecución.
Utiliza este comando para correr el servidor:

```bash
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8080
```

# 4. Desarrollo del Frontend en Android Studio

Pasos para Configurar el Proyecto en Android Studio

## Crear un Proyecto Nuevo:
Abre Android Studio y crea un nuevo proyecto con una actividad vacía.
Usa Kotlin como lenguaje de programación. 
**Paso 1**: Crear el Proyecto en Android Studio
Abre Android Studio:
Selecciona "New Project" y elige una plantilla vacía (Empty Activity).

Lenguaje: Elige Kotlin.
Nombre del proyecto: Puedes llamarlo, por ejemplo, ImagePredictor.

**Seleccione la vista Project File**

Configura las versiones de Gradle y Kotlin:

Verifica que estás usando una versión compatible con las dependencias (seleccioné el SDK 29 Andoride 10 en Project Estructura, Modulos el Compile SDK Version 29) Verficiar que en configuracion Lenguage Androdi SDK tenga el paquete instalado . La version de java es la 11.

En tu archivo build.gradle del proyecto, asegúrate de usar las versiones recomendadas para Kotlin y Compose.

```kotlin
android {
    namespace = "com.example.unab"
    compileSdk = 29

    defaultConfig {
        applicationId = "com.example.unab"
        minSdk = 29
        targetSdk = 29
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        viewBinding true
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_11
        targetCompatibility JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = "11"
    }
}
```

## Configurar AndoroidManifest.xml
De app/src/main/res
---kotlin
android {
    namespace = "com.example.unab2"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.unab2"
        minSdk = 33
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

---



## Agregar dependencias necesarias en libs.versions.toml
Busca el archivo libs.versions.toml (Version catalog en las vista Android) en la carpeta gradle script de tu proyecto (generalmente en gradle/libs.versions.toml) y asegúrate de añadir las librerías requeridas para CameraX, Retrofit y Gson. Por ejemplo:

```kotlin
[versions]
agp = "8.8.0"
kotlin = "2.0.0"
coreKtx = "1.10.1"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
lifecycleRuntimeKtx = "2.6.1"
activityCompose = "1.6.1"
composeBom = "2024.04.01"
coroutinesAndroid = "1.7.0"
navigationCompose = "2.7.1"

[libraries]
androidx-compose-ui = { module = "androidx.compose.ui:ui", version = "1.5.0" }
androidx-compose-material3 = { module = "androidx.compose.material3:material3", version = "1.1.1" }

# CameraX
androidx-camera-core = { module = "androidx.camera:camera-core", version = "1.2.2" }
androidx-camera-camera2 = { module = "androidx.camera:camera-camera2", version = "1.2.2" }
androidx-camera-lifecycle = { module = "androidx.camera:camera-lifecycle", version = "1.2.2" }
androidx-camera-view = { module = "androidx.camera:camera-view", version = "1.2.2" }

# Retrofit
retrofit = { module = "com.squareup.retrofit2:retrofit", version = "2.9.0" }
retrofit-gson = { module = "com.squareup.retrofit2:converter-gson", version = "2.9.0" }

# OkHttp
okhttp = { module = "com.squareup.okhttp3:okhttp", version = "4.10.0" }
okhttp-logging = { module = "com.squareup.okhttp3:logging-interceptor", version = "4.10.0" }

# Coroutines
kotlinx-coroutines-android = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-android", version = "1.7.0" }

# Navigation Compose
androidx-navigation-compose = { module = "androidx.navigation:navigation-compose", version = "2.7.1" }

# Core KTX and testing
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }


```

##  Incluir las dependencias en el archivo build.gradle de la app

```
**Salve todo**


## Actualizar dependencias de Gradle
Abre el archivo build.gradle de tu aplicación (ubicado en /app) y asegúrate de agregar estas dependencias para Jetpack Compose, la biblioteca de cámaras y la librería de red Retrofit:

```
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.unab2"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.unab2"
        minSdk = 29
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // Core y UI
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)

    // Test y Debug
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)

    // CameraX
    implementation(libs.androidx.camera.core)
    implementation(libs.androidx.camera.camera2)
    implementation(libs.androidx.camera.lifecycle)
    implementation(libs.androidx.camera.view)

    // Retrofit y OkHttp
    implementation(libs.retrofit)
    implementation(libs.retrofit.gson)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)

    // Navigation Compose
    implementation(libs.androidx.navigation.compose)
}

```
Después de realizar estos cambios, sincroniza tu proyecto en Android Studio.

## Sincronizar el proyecto
Después de realizar estos cambios, sincroniza tu proyecto con Gradle en Android Studio seleccionando "Sync Now". Esto descargará e integrará las nuevas dependencias.


## Paso 3: Configurar Retrofit para el Cliente API

Crea una clase llamada ApiService.kt:
Ubica o crea un archivo kotlin tipo *file* esta clase en la carpeta app/src/main/java/com/example/unab2/

```kotlin
package com.example.myapplication

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
    private const val BASE_URL = "http://<EC2-PUBLIC-IP>:8080/"

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

### Configurar la captura de imágenes con CameraX
En tu archivo MainActivity.kt, configura CameraX para capturar imágenes. Cambia el contenido del archivo como sigue:
```
package com.example.unab2

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.camera.core.Preview
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.CameraSelector
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import java.io.File

class MainActivity : ComponentActivity() {
    private lateinit var imageCapture: ImageCapture

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CameraScreen(
                imageCapture = imageCapture,
                onCapture = { file ->
                    Log.d("CameraScreen", "Imagen capturada: ${file.absolutePath}")
                }
            )
        }
        setupCamera()
    }

    private fun setupCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)

        cameraProviderFuture.addListener({
            // Obtiene el CameraProvider
            val cameraProvider = cameraProviderFuture.get()

            // Crear la instancia de Preview usando el Builder de CameraX
            val preview = Preview.Builder().build()

            // Crear la instancia de ImageCapture
            imageCapture = ImageCapture.Builder().build()

            // Seleccionar la cámara (por ejemplo, la cámara trasera)
            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

            // Crear una vista PreviewView para mostrar la vista previa de la cámara
            val previewView = PreviewView(this)

            // Establecer el SurfaceProvider en el preview
            preview.setSurfaceProvider(previewView.surfaceProvider)

            try {
                // Desvincula cualquier cámara previamente conectada
                cameraProvider.unbindAll()

                // Vincula los componentes de cámara (Preview y ImageCapture)
                cameraProvider.bindToLifecycle(
                    this, cameraSelector, preview, imageCapture
                )

            } catch (exc: Exception) {
                Log.e("MainActivity", "Error al configurar la cámara", exc)
            }

        }, ContextCompat.getMainExecutor(this))
    }
}

@Composable
fun CameraScreen(imageCapture: ImageCapture, onCapture: (File) -> Unit) {
    val context = LocalContext.current
    val photoFile = File(context.externalCacheDir, "captured_image.jpg")
    val previewView = remember { PreviewView(context) }

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        AndroidView(
            factory = { previewView },
            modifier = Modifier
                .weight(1f)
                .fillMaxSize()
        )

        Button(onClick = {
            try {
                val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()
                imageCapture.takePicture(
                    outputOptions,
                    ContextCompat.getMainExecutor(context),
                    object : ImageCapture.OnImageSavedCallback {
                        // Implementación de onError
                        override fun onError(exception: ImageCaptureException) {
                            Log.e("CameraScreen", "Error al capturar imagen", exception)
                        }

                        // Implementación de onImageSaved
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

@Composable
fun PreviewCameraScreen() {
    CameraScreen(imageCapture = ImageCapture.Builder().build(), onCapture = {})
}
```


## 5. Probar la app
Conecta un dispositivo físico o emulador que soporte CameraX.
Ejecuta la app en Android Studio.
Toma una foto y envíala al servidor.
Verifica que las predicciones se muestren como un Toast.

