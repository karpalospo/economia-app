import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback, Image } from "react-native";
import { COLORS, FONTS } from '../../utils/constants';
import { CapitalizeWord } from '../../utils/helper';


ChooseAddress = (props) => 
{
    const {
        visible = false, 
        data = [], 
        selectedAddress = 0, 
        onChooseAddress = () => {},
        onAddAddress = () => {},
        onClose = () => {},
        selectedLocation = '',
        onChooseLocation,
        color = COLORS._1B42CB
    } = props;


    showAddressName = (address) => 
    {   
        return address.alias != '' ? address.alias : address.address;
    }
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {}}
        >

            <View style={styles.container}>

                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.outsideTapView} />
                </TouchableWithoutFeedback>

                <View style={styles.ChooseAddressContainer}>

                    <Text style={[styles.titleText, {color}]}>Seleccione ciudad de pedido</Text>
                    <TouchableOpacity style={styles.locationButton} onPress={onChooseLocation}>
                        <Text style={styles.locationButtonText}>{ CapitalizeWord(selectedLocation)}</Text>
                        <Image style={styles.locationImage} resizeMode='contain' source={require('../../../assets/icons/dropdown_arrow.png')} />
                    </TouchableOpacity>

                    <Text style={[styles.titleText2, {color}]}>¿Dónde enviamos tu pedido?</Text>

                    <View style={styles.addressWrapper}>
                        <FlatList
                            keyExtractor={(item, index) => `address_${index}`}
                            data={data}
                            extraData={props}
                            horizontal={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={styles.addressNameContainer} onPress={() => onChooseAddress(index)}>

                                        <Text style={[styles.addressNameText, {color: index == selectedAddress ? COLORS._657272 : COLORS._A5A5A5, fontWeight: index == selectedAddress ? 'bold' : 'normal'}]}>{showAddressName(item)}</Text>

                                        <View style={styles.selectedAddressIndicatorContainer}>
                                            <View style={[styles.selectedAddressIndicator, {backgroundColor: index == selectedAddress ? COLORS._1B42CB : COLORS.NO_COLOR}]} />
                                        </View>

                                    </TouchableOpacity>
                                )
                            }}
                        />

                    </View>

                    <TouchableOpacity style={[styles.addNewAddressButton, {backgroundColor: color}]} onPress={onAddAddress}>
                        <Text style={styles.addNewAddressButtonText}>Agregar dirección nueva</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={[styles.cancelButtonText, {color}]}>Cancelar</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </Modal>
    )
}

export default ChooseAddress;

const styles = StyleSheet.create({
    
    container: {width: '100%', height: '100%',},
    ChooseAddressContainer: {position: 'absolute', bottom: 0, width: '100%', padding: 25, alignItems: 'center', backgroundColor: COLORS._FFFFFF, borderRadius: 15, elevation: 5, shadowColor: COLORS._BABABA, shadowOpacity: 8, shadowRadius: 5, shadowOffset: {height: 5, width: 5}},

    titleText: {fontSize: 20, fontFamily: FONTS.REGULAR},
    titleText2: {fontSize: 17, fontFamily: FONTS.REGULAR, marginVertical: 20},
    addressWrapper: {width: '100%', maxHeight: 200},
    addressNameContainer: {width: '100%', borderTopWidth: 1, borderColor: COLORS._A5A5A5, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between'},
    addressNameText: {fontSize: 16, fontFamily: FONTS.REGULAR, color: COLORS._A5A5A5 },
    selectedAddressIndicatorContainer: {width: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderRadius: 9, borderWidth: .5, borderColor: COLORS._A5A5A5},
    selectedAddressIndicator: {width: 12, height: 12, borderRadius: 6, },

    addNewAddressButton: {width: '100%', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center', marginTop: 20,},
    addNewAddressButtonText: {fontSize: 16, color: COLORS._FFFFFF, },
    cancelButton: {width: '100%', paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center'},
    cancelButtonText: {fontSize: 16, fontFamily: FONTS.REGULAR, color: COLORS._A5A5A5},

    outsideTapView: {height: '100%', width: '100%', backgroundColor: COLORS.WHITE_80},

    locationButton: {width: '50%', alignSelf: 'center', paddingVertical: 10, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal:20, marginTop:15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: "#ddd" },
    locationButtonText: {fontSize: 15, fontFamily: FONTS.REGULAR, color: COLORS._657272, },
    locationImage: {width: 12, height: 12,},
})