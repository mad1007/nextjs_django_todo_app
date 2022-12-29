export const fetchWithCreds = async (url, method="GET", body)=>{
    const dev = process.env.NEXT_PUBLIC_BUILD_STATUS != "PRODUCTION"
    let targetUrl = url
    if(dev){
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://127.0.0.1:8000"
        targetUrl = baseUrl+url
    }
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
            targetUrl, fetchParams
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