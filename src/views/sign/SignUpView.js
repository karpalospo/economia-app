import React from 'react';
import { View, StyleSheet, Image, ScrollView, Text, TextInput, TouchableOpacity, Modal, Alert, AsyncStorage, DeviceEventEmitter, Linking, BackHandler, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from 'react-navigation';
import * as WebBrowser from 'expo-web-browser';

import { COLORS, SIGNIN_EVENT, PLATFORM, FONTS } from '../../utils/constants';
import CustomDropdown from '../../components/dropdown/CustomDropdown';
import { API, URL, VIDA_SANA_API } from '../../services/service';
import Checkbox from '../../components/checkbox/Checkbox';
import { ValidateEmail, ToISODateString, CapitalizeWord } from '../../utils/helper';

import { FullScreenLoading } from "../../components/loading/FullScreenLoading";
import { CustomDatePicker } from '../../components/date/CustomDatePicker';


const volver = require('../../../assets/icons/volver.png')
const logo = require('../../../assets/la_economia_h.png')


export default class SignUp extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/icons/dropleft_arrow.png')} resizeMode='contain' style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            ),
        }
    }

    state = {
        panelExpanded: false,

        loading: false,

        genderModalVisible: false,
        genders: [
            { name: 'Género', id: '' },
            { name: 'Masculino', id: 'M' },
            { name: 'Femenino', id: 'F' },
        ],

        terms: false,
        vidaSana: false,

        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        lastname: '',
        document: '',
        address: '',
        location: '',
        dateOfBirth: '',
        cellphone: '',
        phone: '',
        gender: 0,

        email_error: false,
        password_error: false,
        name_error: false,
        lastname_error: false,
        document_error: false,
        address_error: false,
        location_error: false,
        gender_error: false,
        dateOfBirth_error: false,
        cellphone_error: false,
        phone_error: false,
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.genderModalVisible) {
                return true
            }
            return false
        })
    }

    UNSAFE_componentWillUnmount() {
        this.backHandler.remove();
    }

    checkLocation = async () => {
        const location = JSON.parse(await AsyncStorage.getItem('location'));

        if (location) {
            this.location = location.id;
        }
        // else
        // {   
        //     DeviceEventEmitter.emit(SHOW_LOCATION_EVENT)
        // }
    }

    vidaSanaSignUp = async (document, firstname, secondname, lastname, secondlastname, dateOfBirth, address, phone, cellphone, email, terms, gender) => {
        await this.checkLocation()
        const vidaSanaRes = await VIDA_SANA_API.POST.PerformVidaSanaSignUp(this.location, document, { document, firstname, secondname, lastname, secondlastname, dateOfBirth, address, phone, cellphone, email, terms, gender }, PLATFORM.APP)

        this.setState({ loading: false })
        if (!vidaSanaRes.error) {
            Alert.alert('Felicidades', 'Se ha completado el proceso de registro.')
            this.props.navigation.navigate('Home')
        }
        else {
            Alert.alert('Atención', 'No se pudo completar tu registro en Vida Sana. ¿Desea volver a intentarlo?', [
                { text: 'Si', onPress: async () => { await this.vidaSanaSignUp(document, firstname, secondname, lastname, secondlastname, dateOfBirth, address, phone, cellphone, email, terms, gender) } },
                {
                    text: 'No', onPress: () => {
                        Alert.alert('Felicidades', "Se ha completado el proceso de registro.")
                        this.props.navigation.navigate('Home')
                    }
                },
            ])
        }
    }

    signUp = async () => {
        let msg = '';

        if (this.state.terms) {
            const checkFields = this.checkEmptyOrInvalidFields();

            if (checkFields.allFieldsAreCorrect === true) {
                this.setState({ loading: true })
                const res = await API.POST.PerformSignUp({ ...this.state })
                
                if (!res.error) {
                    await AsyncStorage.setItem('auth', JSON.stringify({ token: res.message.data.auth_token, email: res.message.data.email, name: res.message.data.nombres, document: this.state.document }))
                    DeviceEventEmitter.emit(SIGNIN_EVENT, { credentials: { email: this.state.email, password: this.state.password }, session: { token: res.message.data.auth_token, email: res.message.data.email, name: res.message.data.nombres, document: this.state.document } })

                    let showCongratsAlert = true

                    if (this.state.vidaSana) {
                        showCongratsAlert = false
                        await this.vidaSanaSignUp(this.state.document, this.state.name, '', this.state.lastname, '', this.state.dateOfBirth, this.state.address, this.state.phone, this.state.cellphone, this.state.email, this.state.terms, this.state.genders[this.state.gender].id)
                    }

                   // await RegisterForPushNotificationsAsync(res.message.data.email)
                    if (showCongratsAlert) {
                        this.setState({ loading: false })
                        Alert.alert('Felicidades', "Se ha completado el proceso de registro.")
                        this.props.navigation.navigate('Home')
                    }
                }
                else {
                    this.setState({ loading: false })
                    msg = "No se pudo completar el registro, esto puede ser debido a que el correo eletrónico ya existe."
                }
            }
            else {
                msg = "Uno o más campos son inválidos.";
                this.setState({ ...checkFields })
            }
        }
        else {
            msg = "Para continuar con el registro debes aceptar los términos y condiciones."
        }

        if (msg != '') {
            Alert.alert('Atención', msg)
        }
    }

    onPressLink = async (link) => {
        await WebBrowser.openBrowserAsync(link)
    }


    checkEmptyOrInvalidFields = () => {
        const email_error = (this.state.email.trim() == '' || !ValidateEmail(this.state.email))
        const password_error = (this.state.password == '' || (this.state.password != this.state.confirmPassword))
        const location_error = (this.state.location == '');
        const name_error = (this.state.name.trim() == '');
        const lastname_error = (this.state.lastname.trim() == '');
        const cellphone_error = (this.state.cellphone.trim() == '');
        const phone_error = (this.state.phone.trim() == '');
        const document_error = (this.state.document.trim() == '');
        const dateOfBirth_error = (this.state.dateOfBirth == '');
        const gender_error = (this.state.gender == 0);
        const address_error = (this.state.address == '');

        const allFieldsAreCorrect = (!email_error && !password_error && !location_error && !name_error && !lastname_error && !phone_error && !cellphone_error && !document_error && !dateOfBirth_error && !gender_error && !address_error);

        return {
            allFieldsAreCorrect,
            email_error,
            password_error,
            location_error,
            name_error,
            lastname_error,
            cellphone_error,
            phone_error,
            document_error,
            dateOfBirth_error,
            gender_error,
            address_error,
        }
    }

    showGenderModal = () => {
        this.setState({ genderModalVisible: !this.state.genderModalVisible, gender_error: false, })
    }

    onSelectGender = async (gender) => {
        this.setState({ genderModalVisible: !this.state.genderModalVisible, gender })
    }

    onChangeDateOfBirth = (dateOfBirth) => {
        this.setState({ dateOfBirth })
    }

    onExpanOrCollapsePanel = () => {
        this.setState({ panelExpanded: !this.state.panelExpanded })
    }

    onPressMailTo = (email) => {
        Linking.openURL(`mailto:${email}`)
    }

    render() {
        return (
            <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>


                    
                    <ScrollView>

                        <View style={styles.imageContainer}>
                            <TouchableOpacity onPress={this.props.navigation.goBack()} style={{marginLeft:17, width:35, height:35, borderRadius:18, backgroundColor:"#ccc", alignItems:"center", justifyContent:"center"}}>
                                <Image source={volver} tintColor="#333" resizeMode='contain' style={{width:16, height:16}} />
                            </TouchableOpacity>
                            <View style={{flex:1, alignItems:"center"}}><Image style={{width: 150, height: 40}} resizeMode='contain' source={logo} /></View>
                            <View style={{width:60}}></View>
                        </View>

          
                        <View style={{paddingHorizontal:25, backgroundColor: "#f0f0f0"}}>


                            <View style={styles.sectionContainer}>

                                <View style={styles.titleContainer}>
                                    <Text style={styles.titleText}>DATOS BÁSICOS</Text>
                                </View>

                                <View style={[styles.inputContainer, { borderColor: !this.state.name_error ? styles.inputContainer.borderColor : COLORS._DF0109 }]}>
                                    <TextInput
                                        ref={ref => this.nameInput = ref}
                                        onSubmitEditing={() => this.lastNameInput.focus()}
                                        placeholder='Nombres'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        autoCapitalize='words'
                                        style={styles.inputStyle}
                                        onChangeText={(name) => this.setState({ name, name_error: false })}
                                        value={this.state.name}
                                    />
                                </View>

                                <View style={[styles.inputContainer, { borderColor: !this.state.lastname_error ? styles.inputContainer.borderColor : COLORS._DF0109 }]}>
                                    <TextInput
                                        ref={ref => this.lastNameInput = ref}
                                        onSubmitEditing={() => this.idInput.focus()}
                                        placeholder='Apellidos'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        autoCapitalize='words'
                                        style={styles.inputStyle}
                                        onChangeText={(lastname) => this.setState({ lastname, lastname_error: false })}
                                        value={this.state.lastname}
                                    />
                                </View>

                                <View style={[styles.inputContainer, { borderColor: !this.state.document_error ? styles.inputContainer.borderColor : COLORS._DF0109 }]}>
                                    <TextInput
                                        ref={ref => this.idInput = ref}
                                        onSubmitEditing={() => this.cityOfBirthInput.focus()}
                                        placeholder='Cédula Ciudadanía'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        keyboardType='numeric'
                                        style={styles.inputStyle}
                                        onChangeText={(document) => this.setState({ document, document_error: false })}
                                        value={this.state.document}
                                    />
                                </View>

                                <View style={[styles.inputContainer, { borderColor: !this.state.email_error ? styles.inputContainer.borderColor : COLORS._DF0109 }]}>
                                    <TextInput
                                        placeholder='Correo Eletrónico'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        autoCapitalize='none'
                                        style={styles.inputStyle}
                                        keyboardType='email-address'
                                        onChangeText={(text) => this.setState({ email: text, email_error: false, })}
                                        value={this.state.email}
                                        onSubmitEditing={() => this.passwordInput.focus()}
                                    />
                                </View>

                                <View style={[styles.inputContainer, { borderColor: !this.state.password_error ? styles.inputContainer.borderColor : COLORS._DF0109 }]}>
                                    <TextInput
                                        ref={ref => this.passwordInput = ref}
                                        onSubmitEditing={() => this.repeatPasswordInput.focus()}
                                        placeholder='Contraseña'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        secureTextEntry={true}
                                        style={styles.inputStyle}
                                        onChangeText={(text) => this.setState({ password: text, password_error: false, })}
                                        value={this.state.password}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={ref => this.repeatPasswordInput = ref}
                                        onSubmitEditing={() => this.nameInput.focus()}
                                        placeholder='Repetir contraseña'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        secureTextEntry={true}
                                        style={styles.inputStyle}
                                        onChangeText={(text) => this.setState({ confirmPassword: text })}
                                        value={this.state.confirmPassword}
                                    />
                                </View>

                                

                                <View style={[styles.inputContainer, { borderColor: !this.state.address_error ? styles.inputContainer.borderColor : COLORS._DF0109 }]}>
                                    <TextInput
                                        ref={ref => this.addressInput = ref}
                                        onSubmitEditing={() => this.phoneInput.focus()}
                                        placeholder='Dirección'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        style={styles.inputStyle}
                                        onChangeText={(address) => this.setState({ address, address_error: false })}
                                        value={this.state.address}
                                    />
                                </View>

                                <View style={[styles.inputContainer, { borderColor: !this.state.cellphone_error ? styles.inputContainer.borderColor : COLORS._DF0109 }]}>
                                    <TextInput
                                        ref={ref => this.phoneInput = ref}
                                        onSubmitEditing={() => this.telephoneInput.focus()}
                                        placeholder='Teléfono Celular'
                                        keyboardType='numeric'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        style={styles.inputStyle}
                                        onChangeText={(cellphone) => this.setState({ cellphone, cellphone_error: false, })}
                                        value={this.state.cellphone}
                                    />
                                </View>

                                <View style={[styles.inputContainer, { borderColor: !this.state.phone_error ? styles.inputContainer.borderColor : COLORS._DF0109 }]}>
                                    <TextInput
                                        ref={ref => this.telephoneInput = ref}
                                        placeholder='Teléfono Fijo'
                                        keyboardType='numeric'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        style={styles.inputStyle}
                                        onChangeText={(text) => this.setState({ phone: text, phone_error: false, })}
                                        value={this.state.phone}
                                    />
                                </View>

                                

                            </View>

                            <View style={styles.sectionContainer}>

                                <View style={styles.titleContainer}>
                                    <Text style={styles.titleText}>DATOS ADICIONALES</Text>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.locationText}>Fecha de nacimiento</Text>
                                    <CustomDatePicker onChangeDate={this.onChangeDateOfBirth.bind(this)} />
                                </View>

                                <View style={[styles.inputContainer, { borderColor: !this.state.location_error ? styles.inputContainer.borderColor : COLORS._DF0109 }]}>
                                    <TextInput
                                        ref={ref => this.cityOfBirthInput = ref}
                                        onSubmitEditing={() => this.addressInput.focus()}
                                        placeholder='Ciudad de nacimiento'
                                        placeholderTextColor={COLORS._A5A5A5}
                                        style={styles.inputStyle}
                                        onChangeText={(location) => this.setState({ location, location_error: false })}
                                        value={this.state.location}
                                    />
                                </View>

                                <TouchableOpacity style={[styles.locationSectionContainer, { borderBottomColor: !this.state.gender_error ? styles.locationSectionContainer.borderBottomColor : COLORS._DF0109 }]}
                                    onPress={this.showGenderModal.bind(this)}>

                                    <Text style={[styles.locationText, { color: this.state.gender != 0 ? COLORS._657272 : styles.locationText.color }]}>
                                        {CapitalizeWord(this.state.genders[this.state.gender].name)}
                                    </Text>
                                    <Image style={styles.locationImage} source={require('../../../assets/icons/dropright_arrow.png')} resizeMode='contain' />

                                </TouchableOpacity>


                            </View>

                            <View style={styles.termsContainer}>
                                <Checkbox checked={this.state.terms} color={COLORS._0A1E63} size={20} onPress={() => this.setState({ terms: !this.state.terms })} />
                                <Text style={styles.termsText}>Acepto <Text style={styles.linkText} onPress={this.onPressLink.bind(this, URL.TERMS)}>Términos y Condiciones.</Text></Text>
                            </View>
                            <View style={styles.termsContainer}>
                                <Checkbox checked={this.state.vidaSana} color={COLORS._0A1E63} size={20} onPress={() => this.setState({ vidaSana: !this.state.vidaSana })} />
                                <Text style={styles.termsText}>Acepto ser parte del Club Vida Sana.</Text>
                            </View>

                            <View style={styles.eticosPanelContainer}>
                                <TouchableOpacity style={styles.eticosPanelButton} onPress={this.onExpanOrCollapsePanel.bind(this)}>
                                    <Text style={styles.eticosPanelButtonText}>Política de privacidad</Text>
                                    <Image style={styles.eticosPanelCollapseIcon} resizeMode='contain' source={this.state.panelExpanded ? require('../../../assets/icons/dropup_arrow.png') : require('../../../assets/icons/dropdown_arrow.png')} />
                                </TouchableOpacity>

                                {this.state.panelExpanded &&
                                    <View style={styles.eticosPanelExpanded}>
                                        <Text style={styles.eticosPanelExpandedText}>ETICOS SERRANO GOMEZ LTDA le informa que los datos suministrados a traves de este sitio web seran tratados para efecto de gestionar la informacion que se requiere por usted de nuestra organizacion, peticion que conlleva el consentimiento de forma inequivoca para el tratamiento de sus datos en el sentido antes dicho. Le rogamos abstenerse de suministrar informacion de caracter sensible, si no es absolutamente necesario para resolver su inquietud. Puede consultar la politica de Proteccion de datos de ETICOS en el siguiente enlace web <Text style={styles.linkText} onPress={this.onPressLink.bind(this, URL.TERMS)}>www.droguerialaeconomia.com</Text> y ejecer sus derechos a conocer, actualizar, rectificar su informacion, o bien solicitar la cancelacion del proceso en el siguiente correo electronico <Text style={styles.linkText} onPress={this.onPressMailTo.bind(this, 'habeasdata@eticos.com')}>habeasdata@eticos.com</Text>.</Text>
                                    </View>}
                            </View>

                            <View style={{height:20}} />

                            <TouchableOpacity style={styles.signUpButton} onPress={this.signUp.bind(this)}>
                                <Text style={styles.signUpButtonText}>Registrarme</Text>
                            </TouchableOpacity>

                            <View style={{height:40}} />
                            
                        </View>


                    </ScrollView>

   
                {this.state.loading && <FullScreenLoading />}

                {/* Gender modal */}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.genderModalVisible}
                    onRequestClose={() => { }}
                >
                    <CustomDropdown title='Género' selectedElement={this.state.gender} data={this.state.genders} itemFormat='capitalize' onSelectElement={this.onSelectGender.bind(this)} />
                </Modal>

            </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white", paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },

    imageContainer: { alignItems: 'center', flexDirection:"row", backgroundColor:"white", paddingBottom: 20, borderBottomColor:"#ccc", borderBottomWidth:1 },


    sectionContainer: { width: '100%', marginVertical: 15 },
    titleContainer: { marginVertical: 10, width: '100%' },
    titleText: { fontSize: 14, color: "#444", fontFamily: FONTS.BOLD },
    inputContainer: { marginVertical: 5, paddingHorizontal:10, backgroundColor: "white", borderRadius:6, borderWidth:1, borderColor: "#ddd"},
    inputStyle: { color: COLORS._657272, fontSize: 16, paddingVertical: 8, fontFamily: FONTS.REGULAR },

    locationSectionContainer: { width: '100%', borderBottomWidth: 1, borderBottomColor: COLORS._B2C3C3, marginVertical: 2, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, alignItems: 'center' },
    locationText: { color: COLORS._A5A5A5, backgroundColor: COLORS._FFFFFF, fontSize: 18, fontFamily: FONTS.REGULAR },
    locationImage: { width: 10, height: 10, },

    datePickerContainer: { width: '100%', margin: 10, justifyContent: 'flex-start', },
    datePickerInputStyle: { width: '100%', color: COLORS._657272, backgroundColor: COLORS._FFFFFF, fontSize: 18, paddingVertical: 10, alignItems: 'flex-start', borderWidth: 0, fontFamily: FONTS.REGULAR },
    datePickerPlaceholderText: { fontSize: 18, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR },
    datePickerText: { fontSize: 18, color: COLORS._657272, fontFamily: FONTS.REGULAR },

    termsContainer: { marginTop: 10, marginLeft:20, alignItems: 'center', flexDirection: 'row' },
    termsText: { fontSize: 15, color: "#666", margin: 10, fontFamily: FONTS.REGULAR },

    signUpButton: { padding: 13, backgroundColor: COLORS._1B42CB, alignItems: 'center', marginVertical: 15, borderRadius: 6, marginHorizontal:20 },
    signUpButtonText: { fontSize: 18, color: COLORS._FFFFFF, fontFamily: FONTS.BOLD },

    linkText: { color: COLORS._1B42CB, fontFamily: FONTS.BOLD  },

    eticosPanelContainer: { width: '100%', padding: 10, },
    eticosPanelButton: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    eticosPanelButtonText: { fontSize: 18, color: COLORS._707070, fontFamily: FONTS.REGULAR },
    eticosPanelCollapseIcon: { width: 15, height: 15 },
    eticosPanelExpanded: { width: '100%', marginVertical: 10 },
    eticosPanelExpandedText: { fontSize: 16, color: COLORS._BABABA, fontFamily: FONTS.REGULAR },

})