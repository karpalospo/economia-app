import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, DeviceEventEmitter, StyleSheet, AsyncStorage, FlatList, Dimensions, Text, Image, Modal } from "react-native";


import { FullWidthLoading } from '../loading/FullWidthLoading';
import LocationSelector from '../components/location/LocationSelector';
import LocationStore from '../reducers/location.reducer';
import { ON_SELECT_LOCATION_EVENT, REDUCER_SAVE_LOCATION, ON_MODIFY_CART_EVENT, FONTS, COLORS } from '../utils/constants';
import { CapitalizeWord } from '../utils/helper';



export const Delivery = (props) => 
{
    const [showLocation, setShowLocation] = useState(false);
    const [location, setLocation] = useState({});
    const {
        loading = false,
        addresses = [], 
        selectedAddress = 0,
        onSelectAddress = () => {},
        onPressAddNewAddress = () => {},
        reCalculateCart = () => {}
    } = props;

    useEffect(() => {
        //console.log(props.location)
        setLocation(props.location)
        return () => {}
    }, [])





    const showAddressName = (address) =>
    {
        if(!address) return '';
        return address.alias != '' ? address.alias : address.address
    }

    const onSelectLocation = async (selectedLocation) =>
    {
        
        

        if(selectedLocation.id != LocationStore.getState().location) 
        {  
 
          LocationStore.dispatch({type: REDUCER_SAVE_LOCATION, location: selectedLocation.id, locationName: CapitalizeWord(selectedLocation.name)})
  
          // Store locally the selected location
          await AsyncStorage.setItem('location', JSON.stringify(selectedLocation))
    
          // Empty the shop cart
          DeviceEventEmitter.emit(ON_MODIFY_CART_EVENT, {quantity: 0})
          DeviceEventEmitter.emit(ON_SELECT_LOCATION_EVENT, {selectedLocation})
        }

        setShowLocation(false)

        setLocation(selectedLocation)
        reCalculateCart()
    }


    return (
        <View style={styles.container}>

            {/* Selected address */}
            <View style={styles.selectedAddressWrapper}>
                <TouchableOpacity onPress={() => setShowLocation(true)} style={styles.ciudadSelected}>
                <Text style={{marginBottom:5, fontSize:16, color: "#666"}}>Ciudad Seleccionada: </Text>
                    <Text style={{marginBottom:5, fontSize:16, color: COLORS._FF2F6C, fontFamily: FONTS.BOLD}}>{location.name}</Text>
                    <Image source={require('../../assets/icons/dropdown_arrow.png')} style={{marginLeft: 10, width: 14, height: 14}} tintColor="#444" resizeMode='contain'  />
                </TouchableOpacity>
                {/* 
                <View style={styles.selectedAddressContainer}> 
                    <Image source={require('../../../assets/icons/shop_cart/circle_location_mark.png')} style={styles.selectedAddressIcon} resizeMode='contain' />
                    <View>
                        <Text style={styles.selectedAddressText}>{`${addresses[selectedAddress] ? addresses[selectedAddress].address : '...'}`}</Text>
                        {showAddressName(addresses[selectedAddress]) != '' &&
                        <Text style={styles.selectedAddressText}>{showAddressName(addresses[selectedAddress])}</Text>}
                    </View>
                </View>

                */}
            </View>

      

            {/* Address list */}
            <View style={styles.addressListWrapper}>                
                                
                {loading && <FullWidthLoading />}

                {addresses.length == 0 && 
                <Text style={styles.addressItemButtonText}>Aún no tienes direcciones...</Text>}

                <FlatList 
                    keyExtractor={(item, index) => `address_${index}`}
                    data={addresses}
                    extraData={props}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity style={[styles.addressItemButton, (index == selectedAddress ? {borderColor: COLORS._1B42CB, backgroundColor:"#f2f2f2"} : {})]} onPress={() => onSelectAddress(index, item.address)}>
                                <Text style={styles.addressItemButtonText}>{showAddressName(item)}</Text>
                                <Text style={[styles.addressItemButtonText, {fontFamily: FONTS.REGULAR}]}>{item.address}</Text>
                            </TouchableOpacity>                                    
                        )
                    }}
                />

                <View style={{height:40}}></View>

                <TouchableOpacity style={styles.addNewAddressButton} onPress={onPressAddNewAddress}>
                    <Image source={require('../../assets/icons/add-circle.png')} style={{width: 20, height: 20}} tintColor="#444" resizeMode='contain'  />
                    <Text style={styles.addNewAddressButtonText} onPress={props.addAddress}>Agregar nueva dirección</Text>
                </TouchableOpacity>

            
            </View>

            {/* Choose location */}
            <Modal
                animationType="fade"
                transparent={false}
                visible={showLocation}
                onRequestClose={() => {}}
            >
                <LocationSelector onSelectLocation = {(selectedLocation) => onSelectLocation(selectedLocation) } onCancel={() => setShowLocation(false)} />
            </Modal>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: COLORS._FFFFFF, paddingHorizontal:10},
    ciudadSelected: {flexDirection: "row", alignItems:"center", borderWidth:1, borderColor:"#f2f2f2", borderRadius: 10, padding: 10, paddingHorizontal:20},
    selectedAddressWrapper: {padding: 20, alignItems: 'center', },
    selectedAddressContainer: {padding: 20, backgroundColor: COLORS._FFFFFF, flexDirection: 'row', alignItems: 'center', borderRadius: 10, elevation: 5, shadowColor: COLORS._000000, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.65, shadowRadius: 2,},
    selectedAddressIcon: { width: 25, height: 25, tintColor: COLORS._FF2F6C},
    selectedAddressText: {fontSize: 18, color: COLORS._707070, marginHorizontal: 15, fontFamily: FONTS.REGULAR},
    selectedAddressNameText: {fontSize: 14, color: COLORS._BABABA, marginHorizontal: 15, fontFamily: FONTS.REGULAR},

    addNewAddressButton: {paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent:"center", backgroundColor: "#f2f2f2", borderRadius: 10, elevation: 5, shadowColor: COLORS._000000, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.65, shadowRadius: 2,},
    addNewAddressButtonText: {fontSize: 18, color: "#444", marginLeft: 10, fontFamily: FONTS.REGULAR },
    
    addressListWrapper: {paddingHorizontal: 30, paddingBottom: 15, },
    addressListTitleText: {fontSize: 22, color: COLORS._657272, marginBottom: 10, fontFamily: FONTS.REGULAR },

    addressItemButton: {borderWidth: 1, borderColor: "white", paddingVertical: 15, paddingHorizontal: 10, backgroundColor:"white", marginVertical: 8, borderRadius: 8, elevation: 5, shadowColor: COLORS._000000, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.65, shadowRadius: 2,},
    addressItemButtonText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.BOLD},
})