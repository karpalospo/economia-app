import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, SafeAreaView} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import Title from "../components/Title";

const left = require('../../assets/icons/product/barcode_left.png')
const right = require('../../assets/icons/product/barcode_right.png')

const Camara = ({onClose, onBarCodeScanned}) => {

    const [hasPermission, setHasPermission] = useState();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, [hasPermission]);

    const handleBarCodeScanned = ({ type, data }) => {
        console.log(data)
        setScanned(true)  
        onBarCodeScanned(data)
        onClose()
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={{padding:10}} >
                <Title title="Búscar por código de barras" onBack={onClose} />
            </View>
            {hasPermission === null && <View />}
            {hasPermission === false &&  <Text>Debe permitir acceso a la cámara</Text>}
            {hasPermission === true &&
            <View style={{flex:1, justifyContent:"center", position:"relative", backgroundColor: "black"}}>
                <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
                <View style={{flex:1, backgroundColor: styles.color, justifyContent: "flex-end"}} >
                    <Text style={styles.titleText}>Encuadre aquí el código de barras del producto</Text>
                </View>
                <View style={{flexDirection: 'row', width: '100%', height: 140}}>
                    <View style={{width: '15%', backgroundColor: styles.color, alignItems: 'flex-end'}}>
                        <Image style={{width: '30%', height: '100%',}} resizeMode= 'contain' source={left} />
                    </View>

                    <View style={{width: '70%'}}>
                        <View style={{width: '100%', height: '10%', backgroundColor: styles.color}} />
                        <View style={{width: '100%', height: '80%', borderColor: "white", borderWidth: 1.5, borderRadius: 5}} />
                        <View style={{width: '100%', height: '10%', backgroundColor: styles.color}} />
                    </View>

                    <View style={{width: '15%', backgroundColor: styles.color, alignItems: 'flex-start'}}>
                        <Image style={{width: '30%', height: '100%',}} resizeMode= 'contain' source={right} />
                    </View>
                </View>
                <View style={{flex:1, backgroundColor: styles.color}} />
            </View>
            }
        </SafeAreaView>
    )
}

export default Camara

const styles = {
    color: "rgba(10,10,40,0.9)",
    container: { flex: 1},

    barCodeContainer: { width: '100%', justifyContent: 'center', backgroundColor: "#657272", height: '40%',},
    titleContainer: {alignSelf: 'center', padding: 20},
    titleText: { fontSize: 15, color: "white", textAlign: 'center', fontFamily: "TommyR", paddingBottom:12},

}