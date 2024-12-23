import axios from "axios";

class Interceptor {
//save the token in the header
    public registerInterceptor(): void {
        axios.interceptors.request.use(request => {
            const token = localStorage.getItem("token");
            if(token) request.headers.Authorization = "Bearer " + token;
            return request;
        })
    }

}

export const interceptor = new Interceptor();