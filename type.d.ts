interface CustomInputProps {
    placeholder? : string;
    value?: string;
    onChangeText? : (text:string) => void;
    label? : string;
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
interface SignInForm {
    email : string,
    password : string
}
interface SignUpForm {
    name : string,
    email : string,
    password : string
}