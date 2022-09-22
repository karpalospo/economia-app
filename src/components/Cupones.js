import React, {useState, useContext} from "react";
import { View, Text, Modal, FlatList, TouchableOpacity, Image } from "react-native";

import { f } from '../utils/helper';
import { format_date } from '../utils/helper';
import Button from "../components/Button";
import { Arrayfy } from "../global/functions";

import { UtilitiesContext } from '../context/UtilitiesContext';

const close = require('../../assets/icons/times.png')


const Cupones = ({visible, onclose}) => {

    const { cupones, setCupon } = useContext(UtilitiesContext)

    const setCuponLocal = (item) => {
        setCupon({IdCupon: false, NombreCupon: item.nombrecupon, Aplica: false, ...item})
        onclose()
    }
    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
        >
            <View style={{padding:20, flex:1, backgroundColor:"rgba(10,10,40,0.8)"}}>
                <View style={{marginTop: 40, padding:5, paddingBottom:20, borderRadius:10, backgroundColor:"white"}}>
                    <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                        <TouchableOpacity onPress={onclose} style={{width:35, height:35, borderRadius:18, backgroundColor:"#222", alignItems:"center", justifyContent:"center"}}>
                            <Image source={close} tintColor="white" resizeMode='contain' style={{width:16, height:16}} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        listKey="cupones"
                        keyExtractor={(item, index) => `method_${index}`}
                        data={Arrayfy(cupones)}
                        style={{marginTop:5, height:"90%"}}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.couponItem}>
                                    <View style={styles.dashed}>
                
                                        <Text style={styles.couponText}>{item.nombrecupon}</Text>
                                        <Text style={styles.couponPrice}>{f(item.valorcupon)}</Text>
                                
                                        <Text style={{paddingVertical:10, color:"white"}}>{f(item.valorcupon)} de descuento para compras mínimas de {f(item.vlrminimo)}. Válido hasta {format_date("normal+time", item.hasta, )}</Text>
                                        <Text style={{color:"white", paddingBottom:10}}>Cupón válido para redimir máximo {item.maximaventacliente} veces por usuario en un mismo día.</Text>
                                        <Text style={{color:"white"}}>Aplican condiciones y restricciones</Text>
                                        <View style={{height:20}} />
                                        <Button onPress={() => setCuponLocal(item)} title="UTILIZAR ESTE CUPÓN" styleMode="pink" buttonStyle={{paddingVertical:10}} />
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>
                
            </View>
            
        </Modal>
    )
}

export default Cupones

const styles = {

    couponItem: {padding: 10, backgroundColor: "#004baa", margin:10, borderRadius:12},
    couponText: {color:"white", fontSize:20, fontWeight:"bold", textAlign: "center", backgroundColor:"rgba(0,0,0,0.2)", padding:3, borderRadius: 5},
    couponPrice: {color:"white", fontSize:24, fontWeight:"bold", textAlign: "center", padding:3, color: "#f1ff34"},
    dashed: {borderWidth:1, borderColor:"white", borderStyle:"dashed", borderRadius: 10, padding: 15},

}