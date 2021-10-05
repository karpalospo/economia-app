import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native';
import { SafeAreaView } from "react-navigation";
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS, FONTS } from '../../utils/constants';

export default class BarcodeScanner extends React.Component {
    state = {
        hasCameraPermission: null,
        scanned: false,
    };

    async componentDidMount() {
        await this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if(status === 'granted')
        {
            this.setState({ hasCameraPermission: true});
        }
        else
        {
            Alert.alert('Atención', 'No se puede acceder a la cámara de tu dispositivo, por favor habilita el permiso de la cámara en el menú de configuración del dispositivo.', 
            [{text: 'Ok', onPress: () => this.props.onClose()}])
        }
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.setState({ scanned: true }, () => {
            this.props.onBarCodeScanned(data)
            this.props.onClose()
        })
    }

    render() {
        const { hasCameraPermission, scanned } = this.state;
        
        // TODO: If user does not grants the camera permission, request the permission again (find the way)
        // TODO: Add styles when user does not grants the camera permission
        if (!hasCameraPermission) {
            return <Text>No hay acceso a la cámara...</Text>
        }

        return (
            <View style={styles.container}>

                <BarCodeScanner
                    onBarCodeScanned={this.handleBarCodeScanned}
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
                    <TouchableOpacity style={styles.closeModalButton} onPress={this.props.onClose}>
                        <Text style={styles.closeModalButtonText}>X</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        )
    }
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