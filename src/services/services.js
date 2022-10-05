


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
const HEADER_URL_ENCODE = {'Content-Type': 'application/x-www-form-urlencoded'}


const HTTP_REQUEST_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
}

export const URL = {
    HOST: 'https://www.droguerialaeconomia.com',
    ETICOS_HOST: 'https://intranet.eticosweb.net',
    S3_GROUPS: 'https://economia-app.s3.ca-central-1.amazonaws.com/economia/groups/',
    server2: "https://www.imperacore.net",
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

export const VIDA_SANA_API = 
{
    GET: {

        async RetrieveWhetherUserBelongsToVidaSanaOrNot (document) {
            return await fetchAsync(`${URL.ETICOS_HOST}/ServicesEpos/wsepos/api/v1/pacientesclub/${document}`, HTTP_REQUEST_METHOD.GET, {headers: {}})
        },
        

        async RetrieveVidaSanaOffers (location, itemsPerPage = 10) {
            return await fetchAsync(`${URL.HOST}/economia/api/ofertas/${location}/${itemsPerPage}/892300678`, HTTP_REQUEST_METHOD.GET)
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
            platform = "APP"
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

        async RetrieveCategories (location, category = '') {
            return await fetchAsync(`${URL.HOST}/economia/api/Categorias/${location}/${category}`, HTTP_REQUEST_METHOD.GET)
        },
        
        async RetrieveGroupsOfCategories (location = '') {
            let response = await fetchAsync(`${URL.HOST}/economia/api/newcategorias/${location}`, HTTP_REQUEST_METHOD.GET)
            if(!response.error) response.error = !response.message.success
            return response
        },
        
        async RetrieveProductsFromSubcategory (location, subcategory, {page = 1, itemsPerPage = 10} = {})
        {
            return await fetchAsync(`${URL.HOST}/economia/api/RefSubCat/${location}/${subcategory}/${page}/${itemsPerPage}/${orderBy}/892300678`, HTTP_REQUEST_METHOD.GET)
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

        async init(data) {
            return await fetchAsync(`${URL.server2}/init`, HTTP_REQUEST_METHOD.POST, { body: FormUrlEncoded(data), headers: HEADER_URL_ENCODE});
        },

        async search(search, location, user) {
            return await fetchAsync(`${URL.server2}/search`, HTTP_REQUEST_METHOD.POST, { body: FormUrlEncoded({search, location, user: JSON.stringify(user)}), headers: HEADER_URL_ENCODE});
        },

        async checkEmail(email) {
            return await fetchAsync(`${URL.HOST}/economia/site/users/sendemailrestore`, HTTP_REQUEST_METHOD.POST, { body: FormUrlEncoded({ email}), headers:  HEADER_URL_ENCODE});
        },

        async cambiarContrasena(email, code, password) {
            return await fetchAsync(`${URL.HOST}/economia/site/users/restorepassv2`, HTTP_REQUEST_METHOD.POST, { body: FormUrlEncoded({ email, code, password}), headers:  HEADER_URL_ENCODE});
        },

        async signin(data) {
            return await fetchAsync(`${URL.server2}/signin`, HTTP_REQUEST_METHOD.POST, { body: FormUrlEncoded({data}), headers: HEADER_URL_ENCODE});
        },

        async PerformRetrieveProductsFromCodeList (codigos, ciudad, { page = 1, items = 1000, convenio = "" } = {})
        {
            return await fetchAsync(`${URL.HOST}/economia/api/referencias/codigos/`, HTTP_REQUEST_METHOD.POST, {body: JSON.stringify({codigos, ciudad, convenio, pagina: page, items}), headers: HEADER_JSON})
        },

        async SignUp (fields)
        {
            return await fetchAsync(`${URL.HOST}/economia/site/users/signup/`, HTTP_REQUEST_METHOD.POST, {body: FormUrlEncoded(fields), headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        },

        async deleteAddress(alias, email, auth_token) {
            const fields = {
                userInfo: {
                    email,
                    auth_token
                },
                MyDireccion: {
                    nombre_direccion: alias
                }
            }
            return await fetchAsync(`${URL.HOST}/economia/site/users/deleteAddress/`, HTTP_REQUEST_METHOD.POST, { body: JSON.stringify(fields), headers: HEADER_JSON});
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


        async PerformRetrieveAddressList(nit, nombres, email, auth_token) {
            return await fetchAsync(`${URL.HOST}/economia/site/users/getMyDirecciones/`, HTTP_REQUEST_METHOD.POST, {body: FormUrlEncoded({nit, email, nombres, auth_token}), headers: HEADER_URL_ENCODE});
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

        async PerformSaveAddress(direccion, nombre_direccion, nit, nombres, email, auth_token, ciudad) {

            const fields = {
                userInfo: {nit,email,nombres,auth_token},
                MyDireccion: {ciudad,nombre_direccion,direccion}
            }
            return await fetchAsync(`${URL.HOST}/economia/site/users/saveMyDirecciones/`, HTTP_REQUEST_METHOD.POST, { body: TwoLevelFormUrlEncoded(fields), headers: HEADER_URL_ENCODE});
        },

        async PerformValidateTypeOfCoupon (Condicion, Productos) 
        {            
            let response = await fetchAsync(`${URL.HOST}/economia/api/validaCondiciones/`, HTTP_REQUEST_METHOD.POST, {body: JSON.stringify({Condicion, Productos})});
            if(!response.message.Success) response.error = true
            return response
        },

        async checkout(basico, bono, user, cupon, productos) {
            const urldata = FormUrlEncoded(basico) + '&' +
            TwoLevelFormUrlEncoded(bono) + 
            TwoLevelFormUrlEncoded(user) +
            TwoLevelFormUrlEncoded(cupon) +
            ArrayFormUrlEncoded(productos);

            return await fetchAsync(`${URL.server2}/checkout`, HTTP_REQUEST_METHOD.POST, {body: urldata, headers: HEADER_URL_ENCODE});
        },
    }

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
