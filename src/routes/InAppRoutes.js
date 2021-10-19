import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, ActivityIndicator, FlatList, SectionList, Alert, DeviceEventEmitter, Platform, Linking} from "react-native";
import { SafeAreaView, } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator,  } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import SignUp from '../../views/sign/SignUpView';
import SignIn from '../../views/sign/SignInView';

import { expo } from "../../app.json";

import SearchProduct from "../views/products/SearchProductView";
import { HomeStack } from "./home/HomeRoutes";
import { COLORS, SHOW_LOCATION_EVENT, SIGNOUT_EVENT, FONTS } from "../utils/constants";
import { ProfileRoutes } from "./profile/ProfileRoutes";

import VidaSanaView from "../views/vida_sana/VidaSanaView";
import { OrderRoutes } from "./orders/OrderRoutes";

const BottomNavStack = createBottomTabNavigator({
    Home: {
      screen: HomeStack,
      navigationOptions: ({ navigation }) => ({
        title: "Inicio",
        tabBarIcon: ({ focused, horizontal, tintColor }) => 
        {
          if(focused) return <Image source={require('../../assets/icons/home.png')} style={{width: 25, height: 25}} resizeMode='contain' tintColor={COLORS._1B42CB} />
          else return <Image source={require('../../assets/icons/home.png')} style={{width: 25, height: 25}} resizeMode='contain'  />
        },
        tabBarOnPress: (args) => {
          args.defaultHandler();
        },
      }),
  
    },
    
    VidaSana: {
      screen: VidaSanaView,
      navigationOptions: ({ navigation }) => ({
        title: "Ofertas",
        tabBarOptions: { 
            activeTintColor: COLORS._FF2F6C,
            inactiveTintColor: '#666',
            showLabel: true,
            showIcon: true,
            style: {
                paddingBottom: Platform.OS == "ios" ? 20 : 0,
                height: Platform.OS == "ios" ? 60 : 60,
                marginBottom: 5,
                marginHorizontal:6,
                marginTop:2,
                borderRadius: 25,
                borderTopWidth: 0,
                elevation: 2, shadowColor: "#BABABA", shadowOffset: {width: 0, heigth: 0}, shadowOpacity: 7, shadowRadius: 15,
            }
        },
        tabBarIcon: ({ focused, horizontal, tintColor }) => 
        {
            if(focused) return <Image source={require('../../assets/icons/oferta.png')} style={{width: 25, height: 25}} resizeMode='contain' tintColor={COLORS._FF2F6C} />
            else return <Image source={require('../../assets/icons/oferta.png')} style={{width: 25, height: 25}} resizeMode='contain'  />
        },
        tabBarOnPress: (args) => {
          args.defaultHandler();
        },
      }),
    },
    
    Orders: {
        screen: OrderRoutes,
        
        navigationOptions: ({ navigation }) => ({
          title: "Mis Compras",
          tabBarIcon: ({ focused, horizontal, tintColor }) => 
          {
            if(focused) return <Image source={require('../../assets/icons/historial.png')} style={{width: 25, height: 25}} resizeMode='contain' tintColor={COLORS._1B42CB} />
            else return <Image source={require('../../assets/icons/historial.png')} style={{width: 25, height: 25}} resizeMode='contain'  />
          },
          tabBarOnPress: (args) => {
            args.defaultHandler();
          },
        }),
    },

    Profile: {
        screen: ProfileRoutes,
        navigationOptions: ({ navigation }) => ({
            title: "Mi Perfíl",
          tabBarIcon: ({ focused, horizontal, tintColor }) => 
          {
            if(focused) return <Image source={require('../../assets/icons/user.png')} style={{width: 25, height: 25}} resizeMode='contain' tintColor={COLORS._1B42CB} />
            else return <Image source={require('../../assets/icons/user.png')} style={{width: 25, height: 25}} resizeMode='contain'  />
          },
          tabBarOnPress: (args) => {
            args.defaultHandler();
          },
        }),
    },
},
{
    lazy: true,
    tabBarOptions: {
        activeTintColor: COLORS._1B42CB,
        inactiveTintColor: '#666',
        showLabel: true,
        showIcon: true,
        style: {
            paddingBottom: Platform.OS == "ios" ? 20 : 0,
            height: Platform.OS == "ios" ? 60 : 60,
            marginBottom: 5,
            marginHorizontal:6,
            marginTop:2,
            borderRadius: 25,
            borderTopWidth: 0,
            elevation: 2, shadowColor: "#BABABA", shadowOffset: {width: 0, heigth: 0}, shadowOpacity: 7, shadowRadius: 15,
        }
    }
})

const InAppStack = createStackNavigator({
  
    SignIn: {
        screen: SignIn,
        navigationOptions: ({ navigation }) => {
          const { params = {} } = navigation.state;
          return {
              headerShown: false,
          }
        },
    },

    SignUp: {
        screen: SignUp,
        navigationOptions: ({ navigation }) => {
          const { params = {} } = navigation.state;
          return {
              headerShown: false,
          }
        },
    },
    Home: {
        screen: createDrawerNavigator({
            Home: {
                screen: BottomNavStack,
                navigationOptions: ({ navigation }) => {
                    return {
                        drawerLockMode: navigation.state.index > 0 ? 'locked-closed' : 'unlocked',
                    }
                }
            },
            SearchProduct: {
                screen: SearchProduct,
                navigationOptions: ({ navigation }) => {
                    const { params = {} } = navigation.state;
                    return {
                        headerStyle: {
                            height: Platform.OS == 'ios' ? 133 : 133,
                        },
                        headerTitle:() => <Header navigation={navigation}/>,
                        headerLeft: () => null,
                    }
                },
            },
        },
        {
            contentComponent: (props) => (
                <SafeAreaView style={styles.container}>

                    <SectionList
                    keyExtractor={(item, index) => `section_${index}`}
                    renderItem={({ item, index, section }) => <View />}
                    extraData={props.screenProps}
                    sections={[
                        { title: 'User', data: [{}], renderItem: ({ item, index, section: { title, data } }) => 
                        {
                            return (
                                <View style={styles.userSectionWrapper}>
                                    <View style={{height:20}}></View>
                                    <View style={styles.sessionWrapper}>
                                        
                                        <TouchableOpacity style={styles.appLogoContainer} disabled={(props.screenProps.loadingCategories || props.screenProps.session.email != '')}
                                        onPress={() => {
                                            props.navigation.navigate('SignIn')
                                            props.navigation.closeDrawer()
                                        }}>
                                            <Image style={styles.appLogo} source={require('../../assets/icons/profile_image.png')} resizeMode='contain'/>
                                        </TouchableOpacity>
                                        
                                        <View style={styles.signContainer}>
                                            <TouchableOpacity style={styles.usernameContainer} disabled={(props.screenProps.loadingCategories || props.screenProps.session.email != '')}
                                            onPress={() => {
                                                props.navigation.navigate('SignIn')
                                                props.navigation.closeDrawer()
                                            }}>
                                                <Text style={styles.signInText}>{props.screenProps.session.email != '' ? `Hola ${props.screenProps.session.name.trim().split(' ')[0]}` : 'Iniciar Sesión'}</Text>
                                                {props.screenProps.session.email == '' && <Text style={styles.signUpText}>{'o regístrate'}</Text>}
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.locationButton} onPress={() => {
                                                DeviceEventEmitter.emit(SHOW_LOCATION_EVENT)
                                                props.navigation.closeDrawer()
                                            }}>
                                                <Text style={styles.locationButtonText}>{props.screenProps.location}</Text>
                                                <Image style={styles.locationImage} resizeMode='contain' source={require('../../assets/icons/dropright_arrow.png')} />
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                    <View style={styles.drawerButtonsWrapper}>

                                        <View style={styles.drawerButtonContainer}>
                                            <TouchableOpacity style={styles.drawerButton} 
                                            onPress={() => {
                                                props.navigation.navigate('Home')
                                                props.navigation.closeDrawer()
                                            }}>
                                                <Text style={styles.drawerButtonText}>INICIO</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.drawerButtonContainer}>
                                            <TouchableOpacity style={styles.drawerButton} 
                                            onPress={async () => {
                                                props.navigation.navigate('Dictionary')
                                                props.navigation.closeDrawer()
                                            }}>
                                                <Text style={styles.drawerButtonText}>DICCIONARIO</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/*<View style={styles.drawerButtonContainer}>
                                            <TouchableOpacity style={styles.drawerButton} 
                                            onPress={async () => {
                                                await WebBrowser.openBrowserAsync('https://www.droguerialaeconomia.com/appsubsidiary')
                                            }}>
                                                <Text style={styles.drawerButtonText}>SUCURSALES</Text>
                                            </TouchableOpacity>
                                        </View>*/}


                                        {props.screenProps.session.email != '' &&
                                        <View style={styles.drawerButtonContainer}>
                                            <TouchableOpacity style={styles.drawerButton} 
                                            onPress={() => {
                                                props.navigation.navigate('Profile')
                                                props.navigation.closeDrawer()
                                            }}>
                                                <Text style={styles.drawerButtonText}>MI CUENTA</Text>
                                            </TouchableOpacity>
                                        </View>}
                                        <View style={styles.drawerButtonContainer}>
                                        <TouchableOpacity style={styles.drawerButton} 
                                            onPress={() => {Linking.openURL(`tel:${6053699090}`)}}>
                                                <Text style={styles.drawerButtonText}>AYUDA</Text>
                                            </TouchableOpacity>
                                        </View>
                                        



                                    </View>


                                </View>
                            )                      
                        }},
                        { title: 'Categories', data: [{}], renderItem: ({ item, index, section: { title, data } }) => {
                            return (
                            <View style={styles.categoriesContainer}>
                                
                                {props.screenProps.loadingCategories &&
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size='large' color={COLORS._1B42CB} />
                                </View>}
            
                                <FlatList
                                keyExtractor={(item, index) => `group_${index}`}
                                data={props.screenProps.categoryGroups}
                                extraData={props.screenProps}
                                renderItem={({ item, index }) => {
                                    const group = item
                                    return (
                                    <View style={styles.groupItemWrapper}>
                                        <TouchableOpacity style={styles.groupItemContainer} onPress={() => {
                                        props.screenProps.groupCategoriesVisible(group.id)
                                        }}
                                        >    
                                            <Text style={styles.groupItemText}>{group.name.toUpperCase()}</Text>
                                            
                                            {/* <Text style={styles.categoryItemText}>{props.screenProps[`visible_${group.id}`] ? '-' : '+'}</Text> */}
            
                                        </TouchableOpacity>

                                        {props.screenProps[`visible_${group.id}`] && 
                                        <View style={styles.categoryItemWrapper}>
                                            <FlatList
                                                keyExtractor={(item, index) => `category_${index}`}
                                                data={group.categories}
                                                extraData={props.screenProps}
                                                renderItem={({ item, index }) => {
                                                    const category = item
                                                    return (
                                                        <View style={styles.categoryItemWrapper}>
                                                            <TouchableOpacity style={styles.categoryItemContainer} onPress={() => {props.screenProps.categorySubCategoriesVisible(category.id)}}>    
                                                                <Text style={styles.categoryItemText}>{category.name}</Text>
                                                                
                                                                {/* <Text style={styles.categoryItemText}>{props.screenProps[`visible_${category.id}`] ? '-' : '+'}</Text> */}
                                
                                                            </TouchableOpacity>

                                                            
                                                            {props.screenProps[`visible_${category.id}`] && 
                                                            <View style={styles.subCategoryItemContainer}>
                                                                <FlatList
                                                                    keyExtractor={(item, index) => `subcategory_${index}`}
                                                                    data={category.subCategories}
                                                                    extraData={props.screenProps}
                                                                    renderItem={({ item, index }) => {

                                                                        return (
                                                                            <TouchableOpacity style={styles.subCategoryItemButton}
                                                                                onPress={() => {
                                                                                    props.navigation.navigate({
                                                                                        routeName: 'Category', 
                                                                                        key: `Category_${index}`,
                                                                                        params: {title: category.name, id: category.id, subCategories: category.subCategories, selectedSubCategory: item.id}})
                                                                                }}
                                                                            >
                                                                                <Text style={styles.subCategoryItemButtonText}>{item.name}</Text>
                                                                            </TouchableOpacity>
                                                                        )
                                                                    }} 
                                                                />
                                                            </View>}
                                                        </View>
                                                    )
                                                }}
                                            />
                                        </View>}

                                    </View>
                                    )
                                }}
                                />
                
                            </View>
                            )
                        }},
                        { title: 'SignOut', data: [{}], renderItem: ({ item, index, section: { title, data } }) => {
                        
                            if(props.screenProps.session.email == '')
                            {
                                return null
                            }

                            return (
                                <View style={styles.drawerButtonsWrapper}>
                                    <View style={styles.drawerButtonContainer}>
                                        <TouchableOpacity style={styles.drawerButton} 
                                        onPress={() => {
                                        Alert.alert('Atención', '¿Seguro que desea cerrar sesión?', [
                                            {text: 'Sí', onPress: () => {
                                                DeviceEventEmitter.emit(SIGNOUT_EVENT)
                                                props.navigation.closeDrawer()
                                            }},
                                            {text: 'No'}
                                        ])
                                        }}>
                                            <Text style={styles.drawerSignOttButtonText}>CERRAR SESIÓN</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.eticosSerranoContainer}>
                                        <Text style={styles.eticosSerranoText}>Powered by <Text style={{fontFamily: FONTS.BOLD}}>Eticos Serrano.</Text></Text>
                                    </View>
                                    <View style={styles.eticosSerranoContainer}>
                                        <Text style={styles.eticosSerranoText}>{`v${expo.version}-2`}</Text>
                                    </View>
                                </View>
                            )
                        }}
                    ]}
                    />

                </SafeAreaView>
            ),
        }),
        navigationOptions: ({ navigation }) => {
            return {
                header: () => null,
            }
        },
    }
},
{
    initialRouteName: 'Home',
    defaultNavigationOptions: {
        headerTintColor: 'white',
    }
})

export default InAppStack;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "flex-start", alignItems: "flex-start", marginTop: "6%", padding: 0},

    sessionWrapper: {width: '100%', flexDirection: 'row', alignItems: 'center'},

    
    signContainer: { width: '65%', },
    usernameContainer: {width: '100%',},
    signInText: {fontSize: 20, color: COLORS._657272,  fontFamily: FONTS.BOLD},
    signUpText: {fontSize: 15, color: COLORS._657272, fontFamily: FONTS.REGULAR},
    locationButton: {width: '100%', paddingTop: 10, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    locationButtonText: {fontSize: 15, fontFamily: FONTS.REGULAR, color: COLORS._657272, },
    locationImage: {width: 12, height: 12,},
    appLogoContainer: {width: '35%', padding: 15, alignItems: 'flex-start',},
    appLogo: {height: 60, width: 60, alignSelf: 'flex-start'},

    drawerButtonContainer: {width: '100%',},
    drawerButton: {width: '100%', paddingVertical: 15, },
    drawerButtonText: {fontSize: 15, fontFamily: FONTS.REGULAR, color: COLORS._657272, },
    drawerSignOttButtonText: {fontSize: 15, color: COLORS._FF2F6C, fontFamily: FONTS.REGULAR },

    userSectionWrapper: {width: '100%'},
    drawerButtonsWrapper: {width: '80%', alignSelf: 'center', borderBottomWidth: 1, borderColor: COLORS._F4F4F4},

    groupItemWrapper: {paddingVertical: 5, justifyContent: 'center'},
    groupItemContainer: { width: '100%', justifyContent: 'space-between', flexDirection: 'row', paddingBottom: 10, paddingLeft: 30},
    groupItemText: { fontSize: 14, color: COLORS._657272, fontFamily: FONTS.BOLD, },

    categoriesContainer: { marginTop: 5, width: '100%',},
    categoryTitleText: { fontSize: 18, color: COLORS._657272,  fontFamily: FONTS.BOLD, marginBottom: 5 },
    categoryItemWrapper: {width: '100%', backgroundColor: COLORS._F2F2F2, paddingVertical: 5},
    categoryItemContainer: { width: '100%', justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 30, paddingBottom: 5},
    categoryItemText: { fontSize: 14, color: COLORS._657272, fontFamily: FONTS.REGULAR },

    subCategoryItemContainer: {paddingVertical: 5, paddingHorizontal: 40, justifyContent: 'center'},
    subCategoryItemButton: {width: '100%', marginVertical: 5},
    subCategoryItemButtonText: {color: COLORS._657272, fontSize: 14, textAlign: 'left', fontFamily: FONTS.REGULAR},

    eticosSerranoContainer: {width: '100%', alignItems: 'flex-end',},
    eticosSerranoText: {fontSize: 15, color: COLORS._657272, fontFamily: FONTS.REGULAR},


    loadingContainer: {width: '100%', alignItems: 'center', padding: 10},
})