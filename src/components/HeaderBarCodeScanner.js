import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, SafeAreaView} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS, FONTS } from '../utils/constants';
import { Camera } from 'expo-camera';

export default function Camara(props) {



    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [cameraRef, setCameraRef] = useState(false);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, [hasPermission]);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>Debe permitir acceso a la camara</Text>;
    }


    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true)  
        props.onBarCodeScanned(data)
        props.onClose()
    }


    return (
        <View style={styles.container}>

            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={{height: '35%', backgroundColor: COLORS._657272_80}} />
            
            <View style={styles.barCodeWrapper}>
                
                <View style={styles.barCodeContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Escanea el código de barras del producto</Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', width: '100%', height: '60%',}}>
                    <View style={{width: '15%', backgroundColor: COLORS._657272_80, alignItems: 'flex-end'}}>
                        <Image style={{width: '30%', height: '100%',}} resizeMode= 'contain' source={require('../../../assets/icons/product/barcode_left.png')} />
                    </View>

                    <View style={{width: '70%'}}>
                        <View style={{width: '100%', height: '10%', backgroundColor: COLORS._657272_80}} />
                        <View style={{width: '100%', height: '80%', borderColor: COLORS._FFFFFF, borderWidth: 1.5, borderRadius: 5}} />
                        <View style={{width: '100%', height: '10%', backgroundColor: COLORS._657272_80}} />
                    </View>

                    <View style={{width: '15%', backgroundColor: COLORS._657272_80, alignItems: 'flex-start'}}>
                        <Image style={{width: '30%', height: '100%',}} resizeMode= 'contain' source={require('../../../assets/icons/product/barcode_right.png')} />
                    </View>
                </View>
            
            </View>

            <View style={{height: '35%', backgroundColor: COLORS._657272_80}} />

            <SafeAreaView style={styles.closeModalContainer}>
                <TouchableOpacity style={styles.closeModalButton} onPress={props.onClose}>
                    <Text style={styles.closeModalButtonText}>X</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: { flex: 1},
    barCodeWrapper: { height: '30%', width: '100%',},
    barCodeContainer: { width: '100%', justifyContent: 'center', backgroundColor: COLORS._657272_80, height: '40%',},
    titleContainer: { width: '60%', alignSelf: 'center', paddingVertical: 10, height: '100%'},
    titleText: { fontSize: 20, color: COLORS._FFFFFF, textAlign: 'center', fontFamily: FONTS.REGULAR},

    closeModalContainer: {position: 'absolute', top: 0, right: 0, padding: 15, },
    closeModalButton: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS._FFFFFF},
    closeModalButtonText: {fontSize: 22, color: COLORS._657272_80, fontFamily: FONTS.REGULAR},
})