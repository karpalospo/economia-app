import React, {useState, useContext, useEffect }  from 'react';
import { View, Text, Modal } from 'react-native';
import { CustomSelectPicker } from './CustomSelectPicker'
import { UtilitiesContext } from '../context/UtilitiesContext'
import Button from "../components/Button";
import Title from "../components/Title";
import { styles } from '../global/styles';

const Ubicacion = ({visible, onSelectLocation, onCancel}) => {

    const [selectedItem, setSelectedItem] = useState(0);

    const {  params } = useContext(UtilitiesContext)

    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={visible}
            onRequestClose={() => onCancel()}
        >
            <View style={styles.containerTrans}>
                
                <View style={_styles.locationContainer}>

                    <Title title="Ubicacion" onCancel={onCancel} />
                    <View style={{height:30}} />
                    <Text style={_styles.label}>¿Desde cuál ciudad quieres comprar?</Text>
                    <View style={{width:"80%", backgroundColor:"#f6f6f6", height:40, marginTop:10, borderRadius:25, borderWidth:1, borderColor: "#aaa"}}>
                        <CustomSelectPicker
                            items={params.centroscostos.map((item, index) => ({label:item.city, value:index}))}
                            style={{ justifyContent: 'center' }}
                            onValueChange={itemValue => setSelectedItem(itemValue.value)}
                            placeHolder="Seleccione..."
                        />
                    </View>
                    <View style={{height:40}} />
                    <Button title="ACEPTAR" onPress={() => onSelectLocation(params.centroscostos[selectedItem])} buttonStyle={{minWidth:220}} />

                    <View style={{height:30}} />

                </View>
            </View>
        </Modal>
    )
    

}

export default Ubicacion

const _styles = {

    locationContainer: { 
        width:"100%",
        alignItems: 'center', 
        backgroundColor: 'white', 
        borderRadius: 10, borderWidth: 1, 
        borderColor:"#eee",
        marginHorizontal:10
    },
    
    label: {fontSize:15, fontFamily: "TommyR", color:"#222"},
    

    changeLocationButton: {width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: "white",},
    changeLocationImage: {width: 15, height: 15,},

    chooseLocationButton: {width: '80%', alignItems: 'center', backgroundColor: "#1B42CB", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, marginVertical: 10},
    chooseLocationButtonText: {fontSize: 15, color: "white", fontFamily: "Roboto", paddingVertical: 5},

    negativeButton: {
        width: '80%', 
        alignItems: 'center', 
        backgroundColor: "transparent", 
        paddingHorizontal: 15, 
        marginVertical: 10,
        borderWidth: 1,
        paddingVertical: 10, 
        paddingHorizontal: 15,
        borderRadius: 8,
        borderColor: "#1B42CB"
    },
    negativeButtonText: {fontSize: 18, color: "#1B42CB", fontFamily: "Roboto"},

    loadingContainer: {position: 'absolute', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(255,255,255,.8)"},
}