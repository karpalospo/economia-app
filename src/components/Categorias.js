import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Modal, Alert, Dimensions, ActivityIndicator } from "react-native";

import { f, CapitalizeWord, IsExcludedCategory } from "../utils/helper";
import { HELPER_API, URL, } from "../services/services";


import Carousel from "./Carousel";
import Cantidad from "./Cantidad";
import { getProducts } from "../services/products";

import { UtilitiesContext } from '../context/UtilitiesContext'

const {height} = Dimensions.get('window')
const volver = require('../../assets/icons/times.png')
const noimage = require('../../assets/icons/product/noimage.png')
const oferta = require('../../assets/icons/oferta2.png')


export const Categorias = ({

    visible = false,

}) => {


    const [loading, setLoading] = useState(true)

    useEffect(() => {


        
    }, [])


 

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={{flex:1, backgroundColor: "rgba(0,0,0,0.6)"}}>
                
                <View style={{backgroundColor:"white", height: "95%", position:"absolute", left: 0, bottom: 0, width:"100%", padding:10, borderTopLeftRadius:15, borderTopRightRadius:15}} >
                    <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                        <TouchableOpacity onPress={() => onClose()} style={{width:35, height:35, borderRadius:18, backgroundColor:"#222", alignItems:"center", justifyContent:"center"}}>
                            <Image source={volver} tintColor="white" resizeMode='contain' style={{width:16, height:16, tintColor: 'white'}} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        {loading && <ActivityIndicator color={"#1B42CB"} />}
                        {!loading && product &&
                        <View style={styles.scrollContainer}>
                            
                            <Text>Contenido</Text>
             
                            
                        </View>
                    }

                    </ScrollView>
                
                </View>

            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    rowCenter: {flexDirection:"row", alignItems:"center", justifyContent: "center"},
    container: {flex: 1},
    scrollContainer: {alignItems: 'center', position: "relative", paddingBottom:40},
    proveedor: {
        paddingHorizontal:10, 
        fontSize:14,
        marginVertical:10, 
        color: "#aaa"
    },
    disponibles: {
        color:"white", 
    },
    productImageContainer: { width: height * .35, height: height * .35, alignItems: 'center', },
    productImage: {height: '100%', width: '100%',},

    productNameContainer: {width: '90%', marginVertical: 10},
 


    productDescriptionContainer: {width: '80%', padding: 15},
    productDescriptionText: {fontSize: 18, color: "#657272", fontFamily: "Roboto"},


    vidaSanaIndicatorContainer: { position: 'absolute', top: 0, left: 30, width: 50, height: 50, justifyContent: 'center', zIndex: 100},
    discountImg: {width:55, height: 55, position:"absolute", zIndex:-1, top:3, right:3},
    descuento: {
        textAlign: "center", 
        fontSize: 19, 
        color:"white", 
        fontFamily: "RobotoB", 
        width:40, height: 26, 
        position:"absolute", 
        textAlign:"center", 
        zIndex:1, 
        top:17, 
        left:0, 
        lineHeight:26
    },
})