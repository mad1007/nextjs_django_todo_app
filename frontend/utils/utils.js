export const fetchWithCreds = async (url, method="GET", body)=>{
    console.log(url)
    const fetchParams = {
        method,
        headers:{'Content-Type':'application/json'},
        mode:"cors",
        credentials:"include"
        
    }
    if(body){
        fetchParams.body = JSON.stringify(body)
    }

    try {
        const response = await fetch(
            url, fetchParams
        )        
        return response

    } catch (error) {
        console.error(error)
        return
    }

}

export const convertDateFormat = (dateString="")=>{
    return dateString.substr(0, dateString.lastIndexOf(":")).replace("T", " ")
  }