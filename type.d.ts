import { Models } from "react-native-appwrite";

interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label?: string;
  labelVisble?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}
interface CustomSearchInputProps {
  icon: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label?: string;
  onSubmitEditing?: () => void;
  returnKeyType?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

interface CustomButtonProps {
  value?: string;
  size?: string;
  onPressTouch?: () => void;
  title?: string;
  style?: "default" | "disabled" | "outlined" | "big-filled";
  leftIcon?: boolean;
  icon?: React.ReactNode;
  textStyle?: string;
  color?: string;
  isLoading?: boolean;
}
interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}
interface SignInParams {
  email: string;
  password: string;
}
interface SignInForm {
  email: string;
  password: string;
}
interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

export interface User extends Models.Row {
  name: string;
  email: string;
  accountId: string;
  avatarUrl: string;
  $id: any;
  $updatedAt: any;
  $createdAt: any;
}
export interface Category extends Models.Row {
  name: string;
  description: string;
}

interface GetMenuParams {
  category: string;
  query: string;
}

interface GetTopRatedMenuParams extends GetMenuParams {
  limit: number;
}

interface MenuItem extends Models.Row {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  $id: any;
  customizations? : string[]
  $updatedAt: any;
  $createdAt: any;
}
interface CartItemType {
  id : string,  
  name: string;
  description: string;
  price: number;
  image_url?: string;
  quantity: number;
  size?: "small" | "medium" | "large" | "extra-large" | "half" | "full" | 'regular';
  customizations: CartCustomization[];
}

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
  type: string;
}
