import { AsyncStorage } from "react-native";
import { REST, PLATFORM, VIDA_SANA_AGREEMENT } from "../utils/constants";
import _ from "lodash";

const HTTP_STATUS_CODE = {
    OK: 200,
    CORRECT: 201, 
    BAD_REQUEST: 400,
    FORBIDDEN: 401,
    NOT_FOUND: 404,
    ERROR_SERVER: 500,
    BAD_GATEWAY: 502,
}

const HEADER_JSON =  { 'content-type': 'application/json' } 

const HTTP_REQUEST_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
}


export const ROUTES = 
{
    MAIN: "principal",
    DICTIONARY: "diccionario",
    BABY: "cuidadobebe",
}


export const ORDER_BY = 
{
    PERCENT: "PJ",
    DESCRIPTION: "DS",
    GREATER: "MY", // From greater value to lower
    LOWER: "MN", // From lower value to greater
}

export const SEARCH_BY = 
{
    CODE: 'code',
    BAR_CODE: 'bar_code',
    TEXT: 'text',
}

export const IN_OFFER = 
{
    YES: "S",
    NO: "N",
}

export const URL = {
    HOST: 'https://www.droguerialaeconomia.com',
    ETICOS_HOST: 'https://intranet.eticosweb.net',
    PY_HOST: 'https://panel.droguerialaeconomia.com',
    server2: "https://imperacore.net",
    S3: 'https://panel-economia.s3.amazonaws.com/economia/',
    // Category groups in S3
    S3_GROUPS: 'https://economia-app.s3.ca-central-1.amazonaws.com/economia/groups/', 

    // Privacy urls
    PRIVACY: 'https://www.droguerialaeconomia.com/about/#/privacidad',
    TERMS: 'https://www.droguerialaeconomia.com/about/#/politicas',
    HABEAS: 'https://www.droguerialaeconomia.com/about/#/habeas',
}


const fetchAsync = async (url, method, { body = {}, headers = {'content-type': 'application/json'}} = {}) => 
{
    const form = (method === HTTP_REQUEST_METHOD.GET || method === HTTP_REQUEST_METHOD.HEAD) ? { method, headers } : { method, headers, body };
    let response = {
        error: true, 
        message: '',
    }

    try {
        const fetchResponse = await fetch(url, form); 
        
        response.error = (fetchResponse.status !== HTTP_STATUS_CODE.OK);
        response.message = await fetchResponse.json();
        
    } catch (error) {
        response.message = error;
    }

    return response;
}

export const HELPER_API = 
{
    HEAD: {
        async CheckIfImageExists (url)
        {
            return await fetchAsync(url, HTTP_REQUEST_METHOD.HEAD)
        }
    }
}


export const PANEL_API = 
{
    GET: {
        async RetrieveBanners (banner, isWeb = true, category = '', group = '') {
            return await fetchAsync(`${URL.PY_HOST}/api/banners/?banner=${banner}&by_web=${isWeb ? 1 : 0}&active=1${category != '' ? `&code_category=${category}` : ''}${group != '' ? `&code_group=${group}` : ''}`, HTTP_REQUEST_METHOD.GET, {headers: {'content-type': 'application/json', 'x-api-key': '8eYNYttS.H5ffyV33cA5gefgjs8Uk9dlK6T1OZzK7'}})
        },

        async RetrieveBrands (page = 0, onlyActiveBrands = true, quantity = 10) {
            return await fetchAsync(`${URL.PY_HOST}/api/brand/?page=${page}&active=${onlyActiveBrands ? 1 : 0}&quantity=${quantity}`, HTTP_REQUEST_METHOD.GET, {headers: {'content-type': 'application/json', 'x-api-key': '8eYNYttS.H5ffyV33cA5gefgjs8Uk9dlK6T1OZzK7'}})
        },

        async RetrieveBrandProducts (brandId, page = 0) {
            return await fetchAsync(`${URL.PY_HOST}/api/products/?page=${page}&brand_id=${brandId}`, HTTP_REQUEST_METHOD.GET, {headers: {'content-type': 'application/json', 'x-api-key': '8eYNYttS.H5ffyV33cA5gefgjs8Uk9dlK6T1OZzK7'}})
        },

        async RetrieveBrandBanners (brandId) {
            return await fetchAsync(`${URL.PY_HOST}/api/slides_brand/?brand_id=${brandId}&by_web=0&active=1`, HTTP_REQUEST_METHOD.GET, {headers: {'content-type': 'application/json', 'x-api-key': '8eYNYttS.H5ffyV33cA5gefgjs8Uk9dlK6T1OZzK7'}})
        },

    },

    POST: {

        async PerformRegisterDeviceForPushNotification (email, device, platform) {
            const body = JSON.stringify({ email, device, platform })
            let response = await fetchAsync(`${URL.PY_HOST}/api/device/`, HTTP_REQUEST_METHOD.POST, {body, headers: {'content-type': 'application/json', 'x-api-key': '8eYNYttS.H5ffyV33cA5gefgjs8Uk9dlK6T1OZzK7'}})

            if(response.message.error)
            {
                response.error = true;
            }

            return response;
        },

    }
}


export const VIDA_SANA_API = 
{
    GET: {

        /**
         * Returns an one position array, if user does not belongs to Vida Sana, the service returns an empty array 
         * 
         * @param {String} document 
         */
        async RetrieveWhetherUserBelongsToVidaSanaOrNot (document) {
            return await fetchAsync(`${URL.ETICOS_HOST}/ServicesEpos/wsepos/api/v1/pacientesclub/${document}`, HTTP_REQUEST_METHOD.GET, {headers: {}})
        },
        
        /**
         * 
         * @param {String} location 
         * @param {Number} itemsPerPage 
         * @param {String} agreement The agreement code. Default 892300678, this is the Vida Sana agreement
         */
        async RetrieveVidaSanaOffers (location, itemsPerPage = 10, agreement = VIDA_SANA_AGREEMENT) {
            return await fetchAsync(`${URL.HOST}/economia/api/ofertas/${location}/${itemsPerPage}/${agreement}`, HTTP_REQUEST_METHOD.GET)
        },
    },
    POST: {
        async PerformVidaSanaSignUp (
            location, 
            createdBy, 
            fields = {
                document: '',
                firstname: '',
                secondname: '',
                lastname: '',
                secondlastname: '',
                dateOfBirth: '',
                address: '',
                phone: '',
                cellphone: '',
                email: '',
                terms: false,
                gender: '',
            }, 
            platform = PLATFORM.WEB
            )
        {
            const _fields = {
                idPaciente: fields.document, 
                nombres: `${fields.firstname} ${fields.secondname} ${fields.lastname} ${fields.secondlastname}`, 
                fechaNacimiento: fields.dateOfBirth, 
                direccion: fields.address, 
                telefono: fields.phone, 
                celular: fields.cellphone, 
                primernombre: fields.firstname,
                segundonombre: fields.secondname,
                primerapellido: fields.lastname,
                segundoapellido: fields.secondlastname,
                email: fields.email, 
                estado: fields.terms ? "A" : "P",
                centroCostos: location,
                genero: fields.gender,
                creadoPor: createdBy,
                fechaCreacion: "",
                modificado: fields.document,
                aceptacondiciones: fields.terms ? "S" : "N", 
                canalconfirmacion: platform,
            }

            return await fetchAsync(`${URL.ETICOS_HOST}/ServicesEpos/wsepos/api/v1/sendpacientes/`, HTTP_REQUEST_METHOD.POST, {body: JSON.stringify(_fields)})
        },
    },
}


export const BONUS_API = 
{
    GET: {
        async RetrieveBonuses (document) {
            let response = await fetchAsync(`${URL.ETICOS_HOST}/ServicesEpos/wsepos/api/v2/ofertasxCedula/${document}`, HTTP_REQUEST_METHOD.GET)
            if(!response.message.success)
            {
                response.error = true
            }
            return response
        },
    },
    POST: {
        async PerformSecondBonusVerification (bonus, products)
        {
            // example bonus:
            /*
            "Bono":
            { 
                "Id":56081, 
                "Cedula":"1231213132", 
                "Estado":"A", 
                "TipoFactura":null, 
                "NumeroFactura":null, 
                "VlrBono":30, REQUERIDO
                "VlrMinimoCompra":60000, 
                "FchRdnDesde":"2018-11-20T00:00:00.000Z", 
                "FchRdnHasta":"2018-11-20T23:59:00.000Z", 
                "Condicion":29, REQUERIDO
                "EsPorcentaje":"S", REQUERIDO
                "Descripcion":"Asegure su aguinaldo 2018-1" 
            }, 
            "Productos":
            [ 
                { 
                    "codigo":"035214", REQUERIDO
                    "cantidad":2, REQUERIDO
                    "price":10000 REQUERIDO
                }, 
                { 
                    "codigo":"085029", 
                    "cantidad":2, 
                    "price":10000 
                } 
            ] 
            */
           const body = JSON.stringify({Bono: bonus, Productos: products})
           
            let response = await fetchAsync(`${URL.ETICOS_HOST}/ServicesEpos/wsepos/api/v2/ValidaCondicionBono/`, HTTP_REQUEST_METHOD.POST, {body,});
            
            if(!response.message.success)
            {
                response.error = true;
            }

            return response;
        },
    }
}

export const API = {
    GET: {

        async RetrieveStores () {
            return await fetchAsync(`${URL.HOST}/economia/api/Ciudades/`, HTTP_REQUEST_METHOD.GET)
        },

        /**
         * 
         * @param {String} location The location of the store I.E: "08001"
         * @param {String} category If set, return the subcategories of this category
         */
        async RetrieveCategories (location, category = '') {
            return await fetchAsync(`${URL.HOST}/economia/api/Categorias/${location}/${category}`, HTTP_REQUEST_METHOD.GET)
        },
        
        async RetrieveGroupsOfCategories (location = '') {
            let response = await fetchAsync(`${URL.HOST}/economia/api/newcategorias/${location}`, HTTP_REQUEST_METHOD.GET)
            if(!response.error)
            {
                response.error = !response.message.success
            }

            return response
        },
        
        async RetrieveProductsFromSubcategory (location, subcategory, {page = 1, itemsPerPage = 10, orderBy = ORDER_BY.DESCRIPTION,} = {})
        {
            const agreement = await shouldAddVidaSanaAgreement()

            return await fetchAsync(`${URL.HOST}/economia/api/RefSubCat/${location}/${subcategory}/${page}/${itemsPerPage}/${orderBy}/${agreement}`, HTTP_REQUEST_METHOD.GET)
        },

        async RetrieveTopOffers (location, itemsPerPage = 10) {
            return await fetchAsync(`${URL.HOST}/economia/api/top/${location}/${itemsPerPage}`, HTTP_REQUEST_METHOD.GET)
        },
        
        async RetrieveOffers (location, itemsPerPage = 10) {
            return await fetchAsync(`${URL.HOST}/economia/api/ofertas/${location}/${itemsPerPage}`, HTTP_REQUEST_METHOD.GET)
        },
        
        async RetrieveAdsBanner (route) {
            return await fetchAsync(`${URL.HOST}/economia/api/anuncios/${route}/`, HTTP_REQUEST_METHOD.GET)
        },
        
        async RetrieveProductFromCode (location, productCode) {
            const agreement = await shouldAddVidaSanaAgreement()
            return await fetchAsync(`${URL.HOST}/economia/api/new_referencias/${location}/${productCode}/${agreement}`, HTTP_REQUEST_METHOD.GET)
        },

        async RetrieveProductFromBarCode (location, barCode) {
            let response = await fetchAsync(`${URL.HOST}/economia/api/referencias/${location}/${barCode}/`, HTTP_REQUEST_METHOD.GET)
            if(!response.error)
            {
                response.message.forEach((element) => {
                    if(element.Nro == 0)
                    {
                        response.error = true
                    }
                });
            }

            return response;
        },

        async RetrieveProductFromSearch (location, search, {page = 0, itemsPerPage = 20, orderBy = ORDER_BY.DESCRIPTION, offer = IN_OFFER.NO } = {}) {
            // return await fetchAsync(`${URL.HOST}/economia/api/referencias/${location}/${search}/${page}/${itemsPerPage}/${orderBy}/${offer}/`, HTTP_REQUEST_METHOD.GET)
            const agreement = await shouldAddVidaSanaAgreement()
            return await fetchAsync(`${URL.HOST}/economia/api/new_referencias/${location}/${search}/${agreement}`, HTTP_REQUEST_METHOD.GET)
        },

        async RetrieveHomeServiceValue (location) {
            return await fetchAsync(`${URL.HOST}/economia/api/VlrDomicilio/${location}`, HTTP_REQUEST_METHOD.GET)
        },

        async RetrieveWhetherCouponIsValidOrNot (coupon, document, name, email, token) {
            let response = await fetchAsync(`${URL.HOST}/economia/api/cupon/${coupon}?user[nit]=${document}&user[email]=${email}&user[nombres]=${name}&user[auth_token]=${token}`, HTTP_REQUEST_METHOD.GET)

            if(!response.message.Success)
            {
                response.error = true;
            }

            return response;
        },

        async RetrieveOrderHistory (document) {
            let response = await fetchAsync(`${URL.HOST}/economia/api/ventasLast/${document}`, HTTP_REQUEST_METHOD.GET)

            if(!response.message.success)
            {
                response.error = true;
            }

            return response;
        },

        async RetrieveOrderStatus (orderId) {
            let response = await fetchAsync(`${URL.HOST}/economia/api/timeline/${orderId}`, HTTP_REQUEST_METHOD.GET)

            if(!response.message.success)
            {
                response.error = true;
            }

            return response;
        },

        async RetrieveOrderDetails (orderId, location) {
            return await fetchAsync(`${URL.HOST}/economia/api/ventasdetalle/${orderId}/${location}`, HTTP_REQUEST_METHOD.GET)
        },

        async RetrieveDictionaryOfMedicines (query) {
            return await fetchAsync(`${URL.HOST}/economia/api/diccionario/?q=${query}`, HTTP_REQUEST_METHOD.GET)
        },

    },
    POST: {

        async search(search, location) {
            return await fetchAsync(`${URL.server2}/search`, HTTP_REQUEST_METHOD.POST, { body: FormUrlEncoded({search, location}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        },

        async checkEmail(email) {
            return await fetchAsync(`${URL.HOST}/economia/site/users/sendemailrestore`, HTTP_REQUEST_METHOD.POST, { body: FormUrlEncoded({ email}), headers:  {'Content-Type': 'application/x-www-form-urlencoded'}});
        },

        async cambiarContrasena(email, code, password) {
            return await fetchAsync(`${URL.HOST}/economia/site/users/restorepassv2`, HTTP_REQUEST_METHOD.POST, { body: FormUrlEncoded({ email, code, password}), headers:  {'Content-Type': 'application/x-www-form-urlencoded'}});
        },

        async PerformSignIn (email, password)
        {
            let response = await fetchAsync(`${URL.HOST}/economia/site/users/login/`, HTTP_REQUEST_METHOD.POST, {body: FormUrlEncoded({email, password}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
            
            if(!response.message.success)
            {
                response.error = true;
            }

            if(!response.error && !await AsyncStorage.getItem('vida_sana'))
            {
                const vidaSanaRes = await VIDA_SANA_API.GET.RetrieveWhetherUserBelongsToVidaSanaOrNot(response.message.data.nit)

                if(!vidaSanaRes.error)
                {
                    await AsyncStorage.setItem('vida_sana', (vidaSanaRes.message.length === 0) ? '0' : '1') 
                }
            }

            return response;
        },

        async PerformRetrieveProductsFromCodeList (codigos, ciudad, { page = 1, items = 1000, convenio = "" } = {})
        {
            return await fetchAsync(`${URL.HOST}/economia/api/referencias/codigos/`, HTTP_REQUEST_METHOD.POST, {body: JSON.stringify({codigos, ciudad, convenio, pagina: page, items}), headers: HEADER_JSON})
        },

        async PerformSignUp (fields)
        {
            const _fields = {
                email: fields.email, 
                nombres: `${fields.name} ${fields.lastname}`, 
                nit: fields.document, 
                fecha_nacimiento: fields.dateOfBirth, 
                telefono: fields.phone, 
                celular: fields.cellphone, 
                password: fields.password, 
                confirm_password: fields.password, 
                acepta_condiciones: fields.terms, 
            }

            let response = await fetchAsync(`${URL.HOST}/economia/site/users/signup/`, HTTP_REQUEST_METHOD.POST, {body: FormUrlEncoded(_fields), headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
            
            if(!response.message.success)
            {
                response.error = true;
            }

            return response;
        },

        async getPedido(id) {
            return await fetchAsync(`${URL.HOST}/economia/api/pedidos/getbyid/${id}`, HTTP_REQUEST_METHOD.POST)
        },

        async PerformPasswordRecovery (email)
        {
            let response = await fetchAsync(`${URL.HOST}/economia/site/users/restore/`, HTTP_REQUEST_METHOD.POST, {body: JSON.stringify({email}),});
            
            if(!response.message.success)
            {
                response.error = true;
            }

            return response;
        },


        async PerformRetrieveAddressList (document, name, email, token)
        {
            let response = {
                error: false,
                message: '',
            }

            const validateToken = await this.ValidateToken(document, name, email, token)
            if(validateToken.error)
            {
                response.error = true;
                response.message = REST.TOKEN.ERROR;
            }
            else
            {
                const _fields = {
                    nit: document,
                    email,
                    nombres: name, 
                    auth_token: token,
                }
                
                const body = FormUrlEncoded(_fields);
                
                response = await fetchAsync(`${URL.HOST}/economia/site/users/getMyDirecciones/`, HTTP_REQUEST_METHOD.POST, {body, headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
                
                if(!response.message.success)
                {
                    response.error = true;
                }
            }

            return response;

        },

        async PerformRetrieveProfileInformation (document, name, email, token)
        {
            let response = {
                error: false,
                message: '',
            }

            const validateToken = await this.ValidateToken(document, name, email, token)
            if(validateToken.error)
            {
                response.error = true;
                response.message = REST.TOKEN.ERROR;
            }
            else
            {
                const _fields = {  
                    nit: document,
                    email,
                    nombres: name, 
                    auth_token: token,
                }

                const body = FormUrlEncoded(_fields);

                response = await fetchAsync(`${URL.HOST}/economia/site/users/userProfile`, HTTP_REQUEST_METHOD.POST, {body, headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
                
                if(!response.message.success)
                {
                    response.error = true;
                }
            }

            return response;

        },

        async PerformEditProfile(document, name, email, token, {password = '', newName, newDocument, dateOfBirth, phone, cellphone})
        {
            let response = {
                error: false,
                message: '',
            }

            const _fields = {
                userInfo: {    
                    nit: document,
                    email,
                    nombres: name, 
                    auth_token: token,
                },
                user: {
                    email,
                    password,
                    confirm_password: password,
                    nombres: newName, 
                    nit: newDocument,
                    fecha_nacimiento: dateOfBirth,
                    celular: cellphone,
                    telefono: phone,
                }
            }
            
            response = await fetchAsync(`${URL.HOST}/economia/site/users/updateUserProfile`, HTTP_REQUEST_METHOD.POST, {body: TwoLevelFormUrlEncoded(_fields), headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
            
            if(!response.message.success)
            {
                response.error = true;
            }
            

            return response;

        },

        async PerformSaveAddress (address, alias, document, name, email, token, ciudad)
        {
            let response = {
                error: false,
                message: '',
            }
            
            const validateToken = await this.ValidateToken(document, name, email, token)
            if(validateToken.error)
            {
                response.error = true;
                response.message = REST.TOKEN.ERROR;
            }
            else
            {
                const _fields = {
                    userInfo: {    
                        nit: document,
                        email,
                        nombres: name, 
                        auth_token: token,
                    },
                    MyDireccion: {
                        ciudad,
                        nombre_direccion: alias,
                        direccion: address,
                    }
                }
                
                response = await fetchAsync(`${URL.HOST}/economia/site/users/saveMyDirecciones/`, HTTP_REQUEST_METHOD.POST, {body: TwoLevelFormUrlEncoded(_fields), headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
                
                if(!response.message.success)
                {
                    response.error = true;
                }
            }


            return response;

        },


        async PerformValidateTypeOfCoupon (typeOfCoupon, products) 
        {            
            let response = await fetchAsync(`${URL.HOST}/economia/api/validaCondiciones/`, HTTP_REQUEST_METHOD.POST, {body: JSON.stringify({Condicion: typeOfCoupon, Productos: products})});
            
            if(!response.message.Success)
            {
                response.error = true;
            }

            return response;

        },

        async checkout(a, b, c, d, e) {
            return await fetchAsync(`${URL.server2}/checkout`, HTTP_REQUEST_METHOD.POST, {body: 
                FormUrlEncoded(a) + '&' +
                TwoLevelFormUrlEncoded(b) + 
                TwoLevelFormUrlEncoded(c) +
                TwoLevelFormUrlEncoded(d) +
                ArrayFormUrlEncoded(e), headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        },

        async  PerformPurchase (location, nameOfCity, document, name, email, token, address, paymentMethod, paymentMethod2, orderSubTotal, homeService, products, coupon = {}, bonus = {Aplica: false}, platform = PLATFORM.WEB, deviceOs = '') 
        {
            const fields = {
                formaDePago: paymentMethod,
                Productos: products,
                Cliente: {
                    nit: document,
                    nombres: name,
                    email,
                    auth_token: token, 
                },
                Direccion: address,
                Drogueria: location,
                VlrDomicilio: homeService,
                Ciudad: location,
                nombreCiudad: nameOfCity,
                Subtotal: orderSubTotal,
                Bono: bonus, 
                Cupon: coupon,
                Id_Servicio: platform + deviceOs,
            }
            
            const body = 
                FormUrlEncoded({
                    formaDePago: paymentMethod,
                    tipoPago: paymentMethod2,
                    Direccion: address,
                    Drogueria: location,
                    VlrDomicilio: homeService,
                    Ciudad: location,
                    nombreCiudad: nameOfCity,
                    Subtotal: orderSubTotal,
                    Id_Servicio: platform + deviceOs,
                }) + '&' +
                TwoLevelFormUrlEncoded({Bono: {...fields.Bono}}) + 
                TwoLevelFormUrlEncoded({Cliente: {...fields.Cliente}}) + 
                TwoLevelFormUrlEncoded({Cupon: {...fields.Cupon}}) + 
                ArrayFormUrlEncoded({Productos: {...fields.Productos}})

            let response = await fetchAsync(`${URL.HOST}/economia/api/pedidos/pedidoWebShopping/`, HTTP_REQUEST_METHOD.POST, {body, headers: {'Content-Type': 'application/x-www-form-urlencoded'}});

            if("Success" in response.message)
            {
                response.error = true;
            }

            return response;
        },

        async ValidateToken (document, name, email, token)
        {
            const _fields = {
                nit: document,
                email,
                nombres: name, 
                auth_token: token,
            }

            let response = await fetchAsync(`${URL.HOST}/economia/site/users/validateToken/`, HTTP_REQUEST_METHOD.POST, {body: FormUrlEncoded(_fields), headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
            
            if(!response.message.success)
            {
                response.error = true;
            }

            return response;

        },

        // Delete address /economia/site/users/deleteMyDirecciones
        /*
            body: url-encode
            userInfo: loginCtrl.getUserInfo(),
            MyDireccion: {
                nombre_direccion: nombre_direccion
            }
        */
    },
    PUT: {

    },
    DELETE: {

    },
}


const FormUrlEncoded = (params) => 
{
    return Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
}


const TwoLevelFormUrlEncoded = (params) => 
{
    let urlEncoded = '';

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            for (const childkey in params[key]) {
                if (params[key].hasOwnProperty(childkey)) {
                    urlEncoded += encodeURIComponent(key + '[' + childkey + ']') + '=' + encodeURIComponent(params[key][childkey]) + '&';
                }
            }            
        }
    }
    
    return urlEncoded;
}


const ArrayFormUrlEncoded = (params) => 
{
    let urlEncoded = '';

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            for (const childkey in params[key]) {
                if (params[key].hasOwnProperty(childkey)) {
                    for (const childOfChildKey in params[key][childkey]) {
                        if (params[key][childkey].hasOwnProperty(childOfChildKey)) {
                            urlEncoded += encodeURIComponent(key + '[' + childkey + ']' + '[' + childOfChildKey + ']' ) + '=' + encodeURIComponent(params[key][childkey][childOfChildKey]) + '&';
                        }
                    }
                }
            }
        }
    }
    
    return urlEncoded;
}

const shouldAddVidaSanaAgreement = async () =>
{
    const enrolledToVidaSana = await AsyncStorage.getItem('vida_sana')
    let agreement = '' 
    
    if(enrolledToVidaSana)
    {
        if(enrolledToVidaSana === '1')
        {
            agreement = VIDA_SANA_AGREEMENT
        }
    }

    return agreement
}