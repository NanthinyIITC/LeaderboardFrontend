export interface User{  
    Email?: string;
    Password?: string; 

}
export interface AuthRequest{  
    Email?: string;
    Password?: string; 
    AuthorizationCode:string;
    LoginType:string
}