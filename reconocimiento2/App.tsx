import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Platform, Image } from 'react-native';
import axios from 'axios';
import { launchCamera } from 'react-native-image-picker';
import { PermissionsAndroid, Platform as RNPlatform } from 'react-native'; // Para permisos en Android
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
    Tts.setDefaultLanguage('es-ES'); // Configura el idioma a español
    Tts.setDefaultRate(0.5); // Configura la velocidad de la voz
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
    flexWrap: 'wrap',  // Permite el salto de línea
    lineHeight: 30,    // Aumenta la altura de las líneas para que no se vean demasiado pegadas
    width: '80%',      // Ajusta el ancho para que pueda hacer el salto de línea sin que el texto se desborde
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
