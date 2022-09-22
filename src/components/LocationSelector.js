import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/services';
import { FormatLocationItem } from '../utils/formatter';
import { CustomSelectPicker } from './CustomSelectPicker'

export default class LocationSelector extends React.PureComponent
{

    state = 
    {
        loading: true,
        locationModalVisible: false,

        showCancelButton: true,
        selectedItem: 0,
        locations: [],
    }

    async componentDidMount()
    {
        

        await this.retrieveLocations()
    }

    retrieveLocations = async () =>
    {
        const location = JSON.parse(await AsyncStorage.getItem('location'))


        this.setState({loading: true})

        const res = await API.GET.RetrieveStores();

        let _state = {
            loading: false,
            locations: [],
            currentLocation: location, 
            showCancelButton: true
        }

        if(!res.error)
        {
            for (let i = 0; i < res.message.length; i++) {
                const location = res.message[i];
                _state.locations.push(FormatLocationItem(location));
            }
        }
        else
        {
            Alert.alert('Atención', 'No se pudo obtener el listado de ciudades.', [
                {text: 'Reintentar', onPress: async ()=> await this.retrieveLocations()},
            ])
        }

        this.setState({..._state})
        
    }

    onConfirmSelection = () => 
    {

        this.props.onSelectLocation(this.state.locations[this.state.selectedItem]);

    }


    onCancelSelection = () => 
    {
        this.props.onCancel()
    }


    render()
    {

        return (
            <View style={styles.container}>
                
                <View style={styles.locationContainer}>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>UBICACIÓN</Text>
                    </View> 
                    <View style={{height:30}} />
                    <Text>¿Desde cuál ciudad quieres comprar?</Text>
                    <View style={{width:"80%", backgroundColor:"#f6f6f6", height:40, marginTop:10, borderRadius:6, borderWidth:1, borderColor: "#ccc"}}>
                        <CustomSelectPicker
                            items={this.state.locations.map((item, index) => ({id:index, label:item.name, value:index}))}
                            style={{ justifyContent: 'center' }}
                            onValueChange={itemValue => this.setState({selectedItem: itemValue.value})}
                            placeHolder="Seleccione..."
                            InitialselectedItem={(this.state.currentLocation ? this.state.currentLocation.name : "Seleccione...")}
                        />
                    </View>
                    <View style={{height:60}} />
                    <TouchableOpacity style={styles.chooseLocationButton} onPress={this.onConfirmSelection.bind(this)}>
                        <Text style={styles.chooseLocationButtonText}>ACEPTAR</Text>
                    </TouchableOpacity>

                    {this.state.showCancelButton &&
                    <TouchableOpacity style={styles.negativeButton} onPress={this.onCancelSelection.bind(this)}>
                        <Text style={styles.negativeButtonText}>Cancelar</Text>
                    </TouchableOpacity>}

                    {this.state.loading &&
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' color={"#1B42CB"} />
                    </View>}
                    <View style={{height:20}} />

                </View>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(10,10,40,0.8)'},

    locationContainer: { 
        width: '80%', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        borderRadius: 10, borderWidth: 1, 
        borderColor:"#eee"  
    },

    titleContainer: {
        width: '100%', 
        paddingVertical: 10, 
        paddingLeft:20,
        marginBottom:10, 
        backgroundColor: "#eee", 
        borderTopLeftRadius: 8, 
        borderTopRightRadius: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },

    titleText: {
        fontSize: 15, 
        color: 'rgba(0,0,0,.6)', 
        fontFamily: "RobotoB"
    },

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
})