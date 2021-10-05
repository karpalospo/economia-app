export const COLORS = {
    _1B42CB: "#1B42CB",
    _0A1E63: "#0A1E63",
    _FF2F6C: "#FF2F6C",
    _FF4822: "#FF4822",
    _657272: "#657272",
    _B2C3C3: "#B2C3C3",
    _A5A5A5: "#A5A5A5",
    _9EA6A6: "#9EA6A6",
    _F4F4F4: "#F4F4F4",
    _F2F2F2: "#F2F2F2",
    _BABABA: "#BABABA",
    _707070: "#707070",
    _DF0109: "#DF0109",
    _FFFFFF: "#FFFFFF",
    _000000: "#000000",
    _FF1412: "#FF1412",

    NO_COLOR: 'rgba(0,0,0,0)',
    MAIN_BLUE_80: 'rgba(10, 30, 99, .8)',
    MAIN_COLOR_90: 'rgba(10, 30, 99, 0.9)',
    BLACK_60: 'rgba(0,0,0,.6)',
    BLACK_80: 'rgba(0,0,0,.8)',
    BLACK_90: 'rgba(0,0,0,.9)',
    WHITE_60: 'rgba(255,255,255,.6)',
    WHITE_80: 'rgba(255,255,255,.8)',
    WHITE_90: 'rgba(255,255,255,.9)',
    _657272_80: 'rgba(101, 114, 114, 0.88)',

}

// Request errors
export const REST = {
    TOKEN: {
        ERROR: 'TOKEN_ERROR', 
    }
}

// Input type
export const INPUT_TYPE = {
    INPUT: 'INPUT',
    EMAIL: 'EMAIL',
    NUMBER: 'NUMBER',
    PASSWORD: 'PASSWORD',
    DATE: 'DATE',
}

// Fonts
export const FONTS = {
    REGULAR: 'monserrat',
    BOLD: 'monserratB',
}


export const PLATFORM = {
    APP: 'APPV.3.0.1',
    WEB: 'WebPage',
}

export const BEST_SELLER = 
{
    OFFERS: 'OFFERS',
    SELLERS: 'SELLERS',
}

export const ADS_GALLERY = 
{
    HOME: 1,
    CUIDADO_BEBE: 2,
    DROGUERIA_VIRTUAL: 3,
    DICCIONARIO: 4,
    PUBLICIDAD: 5,
    VIDA_SANA: 6,
    CATEGORIAS: 7,    
    GRUPOS: 8,    
}

export const BRANDS = {
    PRODUCT_CODE: 1,
    PRODUCT_SEARCH: 2,
}

// The total of characters needed until search automatically
export const TOTAL_CHARS_UNTIL_SEARCH = 4;

// Total of allowed addresses
export const TOTAL_ALLOWED_ADDRESS = 10;

// The Tax applied to bag within pruchase order
export const BAG_TAX_ID = "824074"
export const DELIVERY_TAX_ID = "999992"

// Bonuses 
export const BONUS = {
    NEGATIVE: "N",
    POSITIVE: "S",
}

// Order statuses
export const ORDER_STATUS = 
{
    PROCESSED: "FACTURADO",
    ASSIGNED: "ASIGNADO",
    REASSIGNED: "REASIGNADO",
    ON_THE_WAY: "RECOGIDO",
    DELIVERED: "ENTREGADO",
}

// Vida Sana
export const VIDA_SANA_AGREEMENT = '892300678'

// Events name
export const SHOW_LOCATION_EVENT                = 'ShowLocationModal';
export const ON_SELECT_LOCATION_EVENT           = 'OnSelectLocation';
export const SET_CATEGORIES_EVENT               = 'SetCategories';
export const SIGNIN_EVENT                       = 'OnSignIn';
export const SIGNOUT_EVENT                      = 'OnSignOut';
export const ON_MODIFY_ADDRESS_EVENT            = 'OnModifyAddress';
export const ON_CHANGE_DEFAULT_ADDRESS_EVENT    = 'OnChangeDefaultAddress';
export const ON_EDIT_PROFILE_EVENT              = 'OnEditProfile';
export const ON_MODIFY_CART_EVENT               = 'OnModifyCart';


// Reducer actions
export const REDUCER_SAVE_LOCATION              = 'CHANGE_LOCATION';
export const REDUCER_SET_CATEGORIES             = 'SET_CATEGORIES';
export const REDUCER_SET_SESSION                = 'SET_SESSION';
export const REDUCER_RESET_SESSION              = 'RESET_SESSION';
export const REDUCER_SET_ADDRESS                = 'SET_ADDRESS';
export const REDUCER_SET_DEFAULT_ADDRESS        = 'SET_DEFAULT_ADDRESS';
export const REDUCER_SET_SHOP_CART              = 'SET_SHOP_CART';
export const REDUCER_SET_SHOP_CART_QUANTITY     = 'SET_SHOP_CART_QUANTITY';
