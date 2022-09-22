import moment from "moment";
import 'moment/min/moment-with-locales' 

export const Truncate = (text, limit = 20) => 
{
    return text.length > limit ? `${text.substr(0, limit)}...` : text;
}

export const format_date = (type, date) => {
    switch(type) {
        case "short": return moment(date).format("MMM DD")
        case "compact": return moment(date).format("YYYY-MM-DD")
        case "compact2": return moment(date).format("DD/MM/YYYY")
        case "normal": return moment(date).format("dddd, DD [de] MMMM [de] YYYY")
        case "normal+time": return moment(date).format("dddd, DD [de] MMMM [de] YYYY [a las] h:mm a")
        case "fromnow": return moment(moment(date)).fromNow(true)
    }
}

export const CapitalizeWord = (word) => 
{
    if(!word)
    {
        return ''
    }

    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)
}

export const CapitalizeWords = (text) => 
{
    if(!text)
    {
        return ''
    }

    let words = text.trim().split(' ');
    let finalText = '';
    for (let index = 0; index < words.length; index++) {
        finalText += CapitalizeWord(words[index]) + ' ';
    }

    return finalText.trim()
}


/**
  * Converts a number into currency format
 * 
 * @param {Number} number 
 * @param {String} currencyPrefix // Currency prefix. Default '$'
 * @param {String} currencySuffix // Default currency suffix like 'USD'. Default ''
 */
export const f = (number, {currencyPrefix = '$', currencySuffix = '', decimalCount = 0, decimal = ",", thousands = "."} = {} ) => {

    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    
        const negativeSign = number < 0 ? "-" : "";
    
        let i = parseInt(number = Math.abs(Number(number) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
    
        return `${currencyPrefix}${negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(number - i).toFixed(decimalCount).slice(2) : "")}${currencySuffix}`;
    } catch (e) {
        return '0';
    }

}



export const sortByKey = (data, key, sort) => {
    if(!data) return
    if(sort == "desc") return data.sort((a,b) => (a[key] > b[key]) ? -1 : ((b[key] > a[key]) ? 1 : 0));
    else return data.sort((a,b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
}



export const ValidateEmail = (email) =>
{
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Converts standard Datetime value to ISOString Date
 * 
 * @param {Date} date 
 */
export const ToISODateString = (date) =>
{
  return date.toISOString().substring(0,10);
}

/**
 * Converts string date into date
 * 
 * @param {String} strDate 
 */
export const ParseStrDate = (strDate) => 
{
    const splitDate= strDate.split("T");
    
    const date = splitDate[0].split("-");
    const time = splitDate[1].split(":");
    
    const dd = parseInt(date[2]);
    const mm = parseInt(date[1]);
    const yyyy = parseInt(date[0]);
    const hh = parseInt(time[0]);
    const min = parseInt(time[1]);
    const ss = parseInt(time[2].split(".")[0]);

    const _date = new Date(yyyy, (mm - 1), dd, hh, min, ss)
    
    return _date
}


export const FormatDate = (date) => 
{
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? (hours < 10 ? "0"+hours : hours) : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    
    return (date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate()) + "/" + ((date.getUTCMonth() + 1) < 10 ? "0" + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1)) + "/" + date.getUTCFullYear() + "  " + strTime;
}


export const IsExcludedCategory = (categoryId) =>
{
    return (
        categoryId === "0100101" || // Medicamentos
        categoryId === "0200809" // Formulas infantiles
    )
}