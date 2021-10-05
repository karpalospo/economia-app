import React from "react";
import { View, Image, Text, TouchableOpacity, DeviceEventEmitter, StyleSheet, Alert, AsyncStorage, ScrollView } from "react-native";
import { COLORS, SIGNIN_EVENT, REST, INPUT_TYPE, REDUCER_SET_SESSION, FONTS, } from "../../utils/constants";
import { API } from "../../services/service";
import { FullScreenLoading } from "../../components/loading/FullScreenLoading";
import SessionStore from "../../reducers/session.reducer";
import { SignInCard } from "../../components/signin/SignInCard";
import { InputCard } from "../../components/profile/InputCard";
import { RegisterForPushNotificationsAsync } from "../../utils/expo_notification/expoPushNotification";

export default class EditProfileView extends React.Component
{

    state = {

        loading: false,
        signInVisible: false,
        signInError: false,

        inputModalVisible: false,
        selectedInput: '',
        inputPlaceholder: '',
        inputType: INPUT_TYPE.INPUT,

        email: '',
        password: '',
        name: '',
        document: '',
        dateOfBirth: '',
        phone: '',
        cellphone: '',
    }

    async componentDidMount()
    {
        await this.getUserInformation()
    }

    getUserInformation = async () =>
    {
        this.setState({loading: true})
        
        let _state = {
            loading: false,
            signInError: false,
        }
        
        const {session} = SessionStore.getState();
        
        const res = await API.POST.PerformRetrieveProfileInformation(session.document, session.name, session.email, session.token)  

        if(!res.error)
        {
            _state.email = res.message.data.email;
            _state.name = res.message.data.nombres;
            _state.dateOfBirth = res.message.data.fecha_nacimiento;
            _state.document = res.message.data.nit;
            _state.cellphone = res.message.data.celular;
            _state.phone = res.message.data.telefono;
        }
        else
        {
            if(res.message == REST.TOKEN.ERROR)
            {
                const credentials = JSON.parse(await AsyncStorage.getItem('credentials'))
                
                if(credentials)
                {
                    const signInError = await this.signIn(credentials.email, credentials.password)
                    if(!signInError)
                    {
                        await this.getUserInformation()
                        return
                    }
                }
                // Show SignIn modal
                _state.signInVisible = true
            }
            else
            {
                _state.loading = false;
            }
        }

        this.setState({..._state})
    }

    /**
     * 
     * @param {String} selectedInput The key of the selected input
     * 
     */
    showInputModal = (selectedInput, inputPlaceholder, inputType = INPUT_TYPE.INPUT) => 
    {
        this.setState({inputModalVisible: true, selectedInput, inputPlaceholder, inputType})
    }

    onSubmitInput = async (input, key) => 
    {
        let currentInput = input;

        this.setState({inputModalVisible: false, [key]: input}, async () => {
            this.setState({loading: true, })

            let _state = {
                loading: false,
                signInError: false,
            }
            
            const {session} = SessionStore.getState();
            
            const res = await API.POST.PerformEditProfile(session.document, session.name, session.email, session.token, {
                newName: this.state.name,
                newDocument: this.state.document, 
                cellphone: this.state.cellphone, 
                phone: this.state.phone, 
                password: this.state.password, 
                dateOfBirth: this.state.dateOfBirth
            })  
            
            if(!res.error)
            {
                const params = {
                    document: res.message.data.nit,
                    name: res.message.data.nombres,
                    email: res.message.data.email,
                    token: res.message.data.auth_token,
                }

                SessionStore.dispatch({type: REDUCER_SET_SESSION, session: params})
                await AsyncStorage.setItem('auth', JSON.stringify(params));

                // TODO: The Alerts does not appear
                // TODO: The account name doest not refresh 
                Alert.alert('Correcto', 'Tus datos han sido actualizados.') 
            }
            else
            {
                _state[key] = currentInput;

                if(res.message == REST.TOKEN.ERROR)
                {
                    const credentials = JSON.parse(await AsyncStorage.getItem('credentials'))
                    
                    if(credentials)
                    {
                        const signInError = await this.signIn(credentials.email, credentials.password)
                        if(!signInError)
                        {
                            await this.onSubmitInput(input, key)
                            return
                        }
                    }
                    // Show SignIn modal
                    _state.signInVisible = true
                }
                else
                {
                    _state.loading = false;
                    Alert.alert('Atención', 'No se pudo modificar los datos de tu cuenta.', 
                    [
                        {text: 'Reintentar', onPress: async () => await this.onSubmitInput(input, key)},
                        {text: 'Volver', onPress: () => this.props.navigation.goBack()}
                    ],
                    {cancelable: false});
                }
            }
    
            this.setState({..._state})
        })

    }

    onCancelInput = () => 
    {
        this.setState({inputModalVisible: false});
    }

    signIn = async (email, password) => {

        const res = await API.POST.PerformSignIn(email, password);
        
        if(!res.error)
        {
            DeviceEventEmitter.emit(SIGNIN_EVENT, {credentials: {email, password}, session:{token: res.message.data.auth_token, email: res.message.data.email, name: res.message.data.nombres, document: res.message.data.nit}})
            await RegisterForPushNotificationsAsync(res.message.data.email)
        }

        return res.error
    }

    onSubmitSignIn = (email, password) => 
    {
        this.setState({signInVisible: false},
        async () => {
            this.setState({loading: true})
            const error = await this.signIn(email, password)

            if(!error)
            {   
                this.setState({loading: false})
                await this.getUserInformation()
            }
            else
            {
                this.setState({loading: false, signInVisible: true, signInError: true})
            }
        })
    }

    onCancelSignIn = () => 
    {
        this.setState({signInVisible: false}, () => this.props.navigation.goBack())
    }

    render()
    {
        return(
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>

                    {/* Header */}
                    <View style={styles.profileContainer}>
                        <View style={styles.profileImageContaner}>
                            <Image style={styles.profileImage} resizeMode='contain' source={require('../../../assets/icons/profile_image.png')} />
                        </View>
                        <Text style={styles.profileNameText}>{this.state.name}</Text>
                    </View>
                    
                    {/* Account */}
                    <View style={styles.optionsMainTitleContainer}>
                        <Text style={styles.optionsMainTitleText}>DATOS DE LA CUENTA</Text>
                    </View>
                    <View style={styles.optionsContainer}>

                        <View style={styles.optionButton}>
                            <Text style={styles.optionTitleText}>Correo</Text>
                            <Text style={styles.optionValueText}>{this.state.email}</Text>
                        </View>

                        <TouchableOpacity style={styles.optionButton} onPress={this.showInputModal.bind(this, 'password', 'Contraseña', INPUT_TYPE.PASSWORD)}>
                            <Text style={styles.optionTitleText}>Contraseña</Text>
                            <Text style={styles.optionValueText}>············</Text>
                        </TouchableOpacity>

                    </View>
                    
                    {/* Personal info */}
                    <View style={styles.optionsMainTitleContainer}>
                        <Text style={styles.optionsMainTitleText}>INFORMACIÓN PERSONAL</Text>
                    </View>
                    <View style={styles.optionsContainer}>

                        <TouchableOpacity style={styles.optionButton} onPress={this.showInputModal.bind(this, 'name', 'Nombre', INPUT_TYPE.INPUT)}>
                            <Text style={styles.optionTitleText}>Nombre</Text>
                            <Text style={styles.optionValueText}>{this.state.name}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={this.showInputModal.bind(this, 'document', 'Cédula', INPUT_TYPE.INPUT)}>
                            <Text style={styles.optionTitleText}>Cédula / NIT / Pasaporte</Text>
                            <Text style={styles.optionValueText}>{this.state.document}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={this.showInputModal.bind(this, 'dateOfBirth', 'Fecha de cumpleaños', INPUT_TYPE.DATE)}>
                            <Text style={styles.optionTitleText}>Fecha de cumpleaños</Text>
                            <Text style={styles.optionValueText}>{this.state.dateOfBirth}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={this.showInputModal.bind(this, 'cellphone', 'Celular', INPUT_TYPE.INPUT)}>
                            <Text style={styles.optionTitleText}>Celular</Text>
                            <Text style={styles.optionValueText}>{this.state.cellphone}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={this.showInputModal.bind(this, 'phone', 'Teléfono', INPUT_TYPE.INPUT)}>
                            <Text style={styles.optionTitleText}>Teléfono</Text>
                            <Text style={styles.optionValueText}>{this.state.phone}</Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>

                {this.state.loading && <FullScreenLoading />}

                <SignInCard navigation={this.props.navigation} visible = {this.state.signInVisible} onSubmit = {this.onSubmitSignIn.bind(this)} onCancel = {this.onCancelSignIn.bind(this)} error = {this.state.signInError} />

                <InputCard visible = {this.state.inputModalVisible} onSubmit = {this.onSubmitInput.bind(this)} onCancel = {this.onCancelInput.bind(this)} placeholder = {this.state.inputPlaceholder} inputKey = {this.state.selectedInput} inputType = {this.state.inputType} />

            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: COLORS._FFFFFF, alignItems: 'center'},
    scrollContainer: {width: '100%'},

    profileContainer: {width: '100%', padding: 30, alignItems: 'center'},
    profileImageContaner: {width: '100%', alignItems: 'center', padding: 15,},
    profileImage: {width: 80, height: 80},
    profileNameText: {fontSize: 22, color: COLORS._657272, fontFamily: FONTS.BOLD},

    optionsMainTitleContainer: {width: '100%', borderBottomColor: COLORS._F4F4F4, paddingHorizontal: 30, paddingVertical: 15, borderBottomWidth: 1, borderColor: COLORS._F4F4F4, marginTop: 10},
    optionsMainTitleText: {fontSize: 13, color: COLORS._657272, fontFamily: FONTS.BOLD},
    
    optionsContainer: {width: '100%', alignItems: 'center', paddingHorizontal: 30,},
    optionButton: {width: '100%', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: COLORS._F4F4F4, paddingVertical: 15, alignItems: 'center'},
    optionTitleText: {fontSize: 16, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR},
    optionValueText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR},

})