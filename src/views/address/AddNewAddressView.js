import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, AsyncStorage, StatusBar } from "react-native";
import { COLORS, REDUCER_SET_ADDRESS, REDUCER_SET_DEFAULT_ADDRESS, FONTS, } from "../../utils/constants";
import { SafeAreaView, NavigationEvents } from "react-navigation";
import SessionStore from "../../reducers/session.reducer";
import { API } from "../../services/service";
import AddressStore from "../../reducers/address.reducer";
import {Select, CheckIcon} from "native-base" 
import { FormatLocationItem } from '../../utils/formatter';
import { HeaderWithTitleAndBackButton } from "../../components/header/HeaderWithTitleAndBackButton";

export default class AddNewAddressView extends React.Component
{
    state = {
        address: '',
        addressAlias: '',
        tipovia: "Carrera",
        principal: "",
        secundario: "",
        numero: "",
        barrio: "",
        complemento: "",
        loading: false,
        language: null,
        locations:[],
        ciudad: {id:0},
        color: COLORS._1B42CB
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
            showCancelButton: true,
            ciudad: location
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

    onAddNewAddress = async () => 
    {

        if(this.state.address != '' && this.state.addressAlias != '')
        {
            this.setState({loading: true})
            const {session} = SessionStore.getState();

            if(this.state.ciudad == undefined) {
                Alert.alert('Dirección', `Seleccione una ciudad.`)
                return
            }

            const res = await API.POST.PerformSaveAddress(this.state.address, this.state.addressAlias, session.document, session.name, session.email, session.token, this.state.ciudad.id);
            
            if(!res.error)
            {
                let addresses = AddressStore.getState().addresses;

                if(addresses.length == 0)
                {
                    await AsyncStorage.setItem('defaultAddress', "0")

                    // If this is the first address, also set as default address
                    AddressStore.dispatch({type: REDUCER_SET_DEFAULT_ADDRESS, defaultAddress: (addresses.length - 1)})
                }
                
                addresses.push({address: this.state.address, alias: this.state.addressAlias})

                Alert.alert('Felicidades', `La dirección ${this.state.addressAlias} ha sido almacenada.`)

                this.setState({loading: false,})
        
                AddressStore.dispatch({type: REDUCER_SET_ADDRESS, addresses})
        
                this.props.navigation.goBack();
            }
            else
            {
                Alert.alert('Atención', 'No se ha podido guardar esta dirección, por favor vuelve a intentarlo.')
                this.setState({loading: false})
            }
        }
        else
        {
            Alert.alert('Atención', 'La dirección y el nombre del domicilio son requeridos.');
        }
    }


    onEdit = async () => {

        this.setState({address: `${this.state.tipovia} ${this.state.principal} #${this.state.secundario} - ${this.state.numero} ${this.state.complemento}, ${this.state.barrio}`})
    }

    onCancel = () => 
    {
        this.props.navigation.goBack();
    }

    render()
    {

        return (

            <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>

                <NavigationEvents onDidFocus={() => {}} />
                <View style={{backgroundColor: "#f2f2f2"}}>
                    <HeaderWithTitleAndBackButton title='Mi Perfíl' subtitle = 'Agregar Nueva Dirección' onPress={() => this.props.navigation.goBack()} />
                </View>

                <ScrollView style={{paddingHorizontal:20}}>
                    
                    <View style={styles.row}>
                        <Text style={styles.label}>Etiqueta</Text>
                        <View style={{flex: 1}}>
                            <TextInput
                                placeholder = 'Ej: Casa, Oficina, Novi@...'
                                placeholderTextColor = {"#ccc"}
                                autoCapitalize='none'
                                maxLength={100}
                                style={styles.inputContainer}
                                onChangeText={(addressAlias) => this.setState({addressAlias})}
                                onBlur={() => this.onEdit()}
                                value={this.state.addressAlias}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Ciudad</Text>
                        <View style={{flex: 1}}>
                            <Select
                                selectedValue={this.state.ciudad}
                                minWidth={200}
                                onValueChange={async (itemValue) => {await this.setState({ciudad: itemValue}); this.onEdit()}}
                                _selectedItem={{bg: COLORS._1B42CB, endIcon: <CheckIcon size={4} />}}
                            >
                                {this.state.locations.map((item, index) => <Select.Item key={"item" + index} label={item.name} value={index} />)}
                                
                            </Select>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Vía Principal</Text>
                        <View style={{flex: 1}}>
                            <Select
                                selectedValue={this.state.tipovia}
                                minWidth={100}
                                onValueChange={async (itemValue) => {await this.setState({tipovia: itemValue}); this.onEdit()}}
                                _selectedItem={{bg: COLORS._1B42CB, endIcon: <CheckIcon size={4} />}}
                            >
                                <Select.Item label="Carrera" value="Carrera" />
                                <Select.Item label="Calle" value="Calle" />
                                <Select.Item label="Avenida" value="Avenida" />
                                <Select.Item label="Avenida Calle" value="Avenida Calle" />
                                <Select.Item label="Autopista" value="Autopista" />
                                <Select.Item label="Manzana" value="Manzana" />
                                <Select.Item label="Diagonal" value="Diagonal" />
                                <Select.Item label="Circular" value="Circular" />
                                <Select.Item label="Transversal" value="Transversal" />
                                <Select.Item label="Vía" value="Vía" />
                                
                            </Select>
                            
                        </View>
                        <TextInput
                            placeholderTextColor = {COLORS._657272}
                            autoCapitalize='none'
                            maxLength={200}
                            style={[styles.inputContainer, {width:70, marginLeft:6}]}
                            onChangeText={(principal) => this.setState({principal})}
                            onBlur={() => this.onEdit()}
                            value={this.state.principal}
                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Vía Secundaria</Text>
                        <View style={{flex: 0.5}}>
                            <TextInput
                                placeholder = '#'
                                placeholderTextColor = {COLORS._657272}
                                autoCapitalize='none'
                                maxLength={200}
                                style={[styles.inputContainer]}
                                onChangeText={(secundario) => this.setState({secundario})}
                                onBlur={() => this.onEdit()}
                                value={this.state.secundario}
                            />
                        </View>
                        <View style={{width:20}} ><Text style={{textAlign:"center"}}> - </Text></View>
                        <View style={{flex: 0.5}}>
                            <TextInput
                                placeholder = ''
                                placeholderTextColor = {"#ccc"}
                                autoCapitalize='none'
                                maxLength={200}
                                style={styles.inputContainer}
                                onChangeText={(numero) => this.setState({numero})}
                                onBlur={() => this.onEdit()}
                                value={this.state.numero}
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
                                onChangeText={v => this.setState({complemento: v})}
                                onBlur={() => this.onEdit()}
                                value={this.state.complemento}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Barrio</Text>
                        <View style={{flex: 1}}>
                            <TextInput
                                placeholder = ''
                                placeholderTextColor = {COLORS._657272}
                                autoCapitalize='none'
                                maxLength={200}
                                style={styles.inputContainer}
                                onChangeText={(barrio) => this.setState({barrio})}
                                onBlur={() => this.onEdit()}
                                value={this.state.barrio}
                            />
                        </View>
                    </View>
               
                    <View style={{backgroundColor:"#f2f2f2", paddingVertical:15, marginTop: 30, borderRadius:15, borderWidth: 1, borderColor:"#ccc"}}>
                        <Text style={{color: "#777", fontSize:14, textAlign: "center"}}>Esta es la dirección que va a agregar</Text>
                        <Text style={{color: "#333", fontSize:17, marginTop:7, textAlign: "center"}}>{this.state.address}</Text>
                    </View>

                    <View style={{alignItems: "center", marginVertical:30}}>
                        <TouchableOpacity style={styles.addNewAddressButton} onPress={this.onAddNewAddress.bind(this)}>
                            <Text style={styles.addNewAddressButtonText}>GUARDAR</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.cancelButton} onPress={this.onCancel.bind(this)}>
                            <Text style={styles.cancelButtonText}>CANCELAR</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.loading &&
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size='large' color={COLORS._0A1E63} />
                        </View>
                    }


                </ScrollView>


            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "white", paddingBottom: 15, paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },
    
    row: {flexDirection:"row", justifyContent: "space-between", alignItems:"center", marginTop:20},

    label: {color: "#666", fontSize:15, textAlign: "right", width:110, marginRight: 15},
    titleText: {fontSize: 20, marginBottom: 30, fontFamily: FONTS.BOLD},

    chooseCityButton: { width: '100%', borderBottomWidth: 1, borderColor: COLORS._B2C3C3, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, alignItems: 'center' },
    chooseCityIcon: {width: 12, height: 12},


    inputContainer: {fontSize: 16, borderWidth: 1, borderColor: "#dedede", paddingVertical: 12, paddingHorizontal:15, color: COLORS._657272, fontFamily: FONTS.REGULAR, borderRadius: 6},
    inputText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR},

    inputPlaceholderText: {fontSize: 14, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR},

    addNewAddressButton: {borderRadius: 10, paddingVertical: 20, maxWidth:150, paddingHorizontal: 35, alignItems: 'center', backgroundColor:COLORS._1B42CB},
    addNewAddressButtonText: {fontSize: 16, color: COLORS._FFFFFF, fontFamily: FONTS.BOLD },
    cancelButton: {borderRadius: 10, paddingVertical: 15, maxWidth:150, paddingHorizontal: 35, alignItems: 'center', borderColor: COLORS._1B42CB, borderWidth: 1, marginTop: 20},
    cancelButtonText: {fontSize: 14, fontFamily: FONTS.REGULAR, color: COLORS._1B42CB},

    loadingContainer: { position: 'absolute', width: '100%', height: '100%', backgroundColor: COLORS.WHITE_80, alignItems: 'center', justifyContent: 'center'}

})