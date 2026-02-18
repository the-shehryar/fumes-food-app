import { Models } from "react-native-appwrite";

interface CustomInputProps {
    placeholder? : string;
    value?: string;
    onChangeText? : (text:string) => void;
    label? : string;
    labelVisble? : boolean
    secureTextEntry? : boolean;
    keyboardType? : "default" | 'email-address' | 'numeric' | 'phone-pad'
}  

interface CustomButtonProps {
    value? : string
    onPressTouch? : () => void
    title? : string;
    style?: 'default' | 'disabled' | 'outlined' | 'big-filled' ;
    leftIcon? : boolean;
    icon? : React.ReactNode;
    textStyle? : string;
    color? : string; 
    isLoading? : boolean;
}  
interface CreateUserParams {
    name : string,
    email : string,
    password : string
}
interface SignInParams {
    email : string,
    password : string
}
interface SignInForm {
    email : string,
    password : string
}
interface SignUpForm {
    name : string,
    email : string,
    password : string
}

export interface User extends Models.Row {
    name: string;
    email: string;
    accountId : string,
    avatarUrl: string;
    $id : any,
    $updatedAt : any,
    $createdAt : any
}