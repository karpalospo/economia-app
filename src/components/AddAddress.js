import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, Modal } from "react-native";

import { API } from "../services/services";

import { UtilitiesContext } from '../context/UtilitiesContext'

import { CustomSelectPicker } from './CustomSelectPicker'

const AddAddress = ({visible = false, onCancel = () => {}, onSuccess = () => {}}) => {


    const { user } = useContext(UtilitiesContext)

    const [addressAlias, setAddressAlias] = useState("");
    const [address, setAddress] = useState("");
    const [tipovia, setTipovia] = useState("Carrera");
    const [principal, setPrincipal] = useState("");
    const [secundario, setSecundario] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [barrio, setBarrio] = useState("");
    const [ciudad, setCiudad] = useState({id:0});

    const [loading, setLoading] = useState(false);
    
    let locations = [
        {id:0, label: "Seleccione...", value: "Seleccione..."}
    ]

    const onAddNewAddress = async () => 
    {

        if(address != '' && addressAlias != '')
        {
  
            //if(ciudad.id = 0) return Alert.alert('Dirección', `Seleccione una ciudad.`)
                
            setLoading(true)
            const res = await API.POST.PerformSaveAddress(address, addressAlias, user.nit, user.nombres, user.email, user.token, ciudad.id);
            setLoading(false)

            if(!res.error) {

                Alert.alert('Felicidades', `La dirección ${addressAlias} ha sido almacenada.`)
                onSuccess()
            }
            else Alert.alert('Atención', 'No se ha podido guardar esta dirección, por favor vuelve a intentarlo.')
            
        } else Alert.alert('Atención', 'La dirección y el nombre del domicilio son requeridos.');
        
    }

    const onEdit = async () => {
        setAddress(`${tipovia} ${principal} #${secundario} - ${numero} ${complemento}, ${barrio}`)
        //this.setState()
    }

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {}}
        >

            <ScrollView style={{paddingHorizontal:20, backgroundColor: "white"}}>
                
                <View style={styles.row}>
                    <Text style={styles.label}>Etiqueta</Text>
                    <View style={{flex: 1}}>
                        <TextInput
                            placeholder = 'Ej: Casa, Oficina, Novi@...'
                            placeholderTextColor = {"#ccc"}
                            autoCapitalize='none'
                            maxLength={100}
                            style={styles.inputContainer}
                            onChangeText={text => setAddressAlias(text)}
                            onBlur={() => onEdit()}
                            value={addressAlias}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Ciudad</Text>
                    <View style={{flex: 1, borderWidth:1, borderColor:"#ddd", height:50, borderRadius:8}}>
    
                        <CustomSelectPicker
                            items={locations.map((item, index) => ({id:index, label:item.name, value:index}))}
                            style={{ justifyContent: 'center' }}
                            onValueChange={itemValue => setCiudad(itemValue.value)}
                            placeHolder="Seleccione..."
                            InitialselectedItem={"Seleccione..."}
                        />

                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Vía Principal</Text>
                    <View style={{flex: 1, borderWidth:1, borderColor:"#ddd", height:50, borderRadius:8}}>

                            <CustomSelectPicker
                            items={[
                                {id:0, label:"Carrera", value:"Carrera" },
                                {id:0, label:"Calle", value:"Calle" },
                                {id:0, label:"Avenida", value:"Avenida" },
                                {id:0, label:"Avenida Calle", value:"Avenida Calle" },
                                {id:0, label:"Autopista", value:"Autopista" },
                                {id:0, label:"Manzana", value:"Manzana" },
                                {id:0, label:"Diagonal", value:"Diagonal" },
                                {id:0, label:"Circular", value:"Circular"},
                                {id:0, label:"Transversal", value:"Transversal" },
                                {id:0, label:"Vía", value:"Vía" }
                            ]}
                            style={{ justifyContent: 'center' }}
                            onValueChange={itemValue => setTipovia(itemValue.value)}
                            placeHolder="Seleccione..."
                            InitialselectedItem={"Seleccione..."}
                        />

                    </View>
                    <TextInput
                        style={[styles.inputContainer, {width:70, marginLeft:6}]}
                        onChangeText={(text) => setPrincipal(text)}
                        onBlur={() => onEdit()}
                        value={principal}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Vía Secundaria</Text>
                    <View style={{flex: 0.5}}>
                        <TextInput
                            placeholder = '#'
                            style={[styles.inputContainer]}
                            onChangeText={text => setSecundario(text)}
                            onBlur={() => onEdit()}
                            value={secundario}
                        />
                    </View>
                    <View style={{width:20}} ><Text style={{textAlign:"center"}}> - </Text></View>
                    <View style={{flex: 0.5}}>
                        <TextInput
                            style={styles.inputContainer}
                            onChangeText={text => setNumero(text)}
                            onBlur={() => onEdit()}
                            value={numero}
                        />
                    </View>


                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Complemento</Text>
                    <View style={{flex: 1}}>
                        <TextInput
                            placeholder = 'Ej: Apto 1, Casa 3, Piso2...'
                            placeholderTextColor = {"#ccc"}
                            autoCapitalize='none'
                            maxLength={200}
                            style={styles.inputContainer}
                            onChangeText={text => setComplemento(text)}
                            onBlur={() =>onEdit()}
                            value={complemento}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Barrio</Text>
                    <View style={{flex: 1}}>
                        <TextInput
                            style={styles.inputContainer}
                            onChangeText={(text) => setBarrio(text)}
                            onBlur={() => onEdit()}
                            value={barrio}
                        />
                    </View>
                </View>
            
                <View style={{backgroundColor:"#f2f2f2", paddingVertical:15, marginTop: 30, borderRadius:15, borderWidth: 1, borderColor:"#ccc"}}>
                    <Text style={{color: "#777", fontSize:14, textAlign: "center"}}>Esta es la dirección que va a agregar</Text>
                    <Text style={{color: "#333", fontSize:17, marginTop:7, textAlign: "center"}}>{address}</Text>
                </View>

                <View style={{alignItems: "center", marginVertical:30}}>
                    <TouchableOpacity style={styles.addNewAddressButton} onPress={() => onAddNewAddress()}>
                        <Text style={styles.addNewAddressButtonText}>GUARDAR</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.cancelButton} onPress={() => onCancel()}>
                        <Text style={styles.cancelButtonText}>CANCELAR</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>


        </Modal>
    )
    
}

export default AddAddress

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "white", paddingBottom: 15, paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },
    
    row: {flexDirection:"row", justifyContent: "space-between", alignItems:"center", marginTop:20},

    label: {color: "#666", fontSize:15, textAlign: "right", width:110, marginRight: 15},
    titleText: {fontSize: 20, marginBottom: 30, fontFamily: "RobotoB"},

    chooseCityButton: { width: '100%', borderBottomWidth: 1, borderColor: "#B2C3C3", flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, alignItems: 'center' },
    chooseCityIcon: {width: 12, height: 12},


    inputContainer: {fontSize: 16, borderWidth: 1, borderColor: "#dedede", paddingVertical: 12, paddingHorizontal:15, color: "#657272", fontFamily: "Roboto", borderRadius: 6},
    inputText: {fontSize: 16, color: "#657272", fontFamily: "Roboto"},

    inputPlaceholderText: {fontSize: 14, color: "#A5A5A5", fontFamily: "Roboto"},

    addNewAddressButton: {borderRadius: 10, paddingVertical: 20, maxWidth:150, paddingHorizontal: 35, alignItems: 'center', backgroundColor:"#1B42CB"},
    addNewAddressButtonText: {fontSize: 16, color: "white", fontFamily: "RobotoB" },
    cancelButton: {borderRadius: 10, paddingVertical: 15, maxWidth:150, paddingHorizontal: 35, alignItems: 'center', borderColor: "#1B42CB", borderWidth: 1, marginTop: 20},
    cancelButtonText: {fontSize: 14, fontFamily: "Roboto", color: "#1B42CB"},


})