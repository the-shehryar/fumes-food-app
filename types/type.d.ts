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

export interface MenuItem extends Models.Row {
  name: string;
  description: string;
  price: number;
  image_url: string;
  rating: number;
  calories: number;
  protein: number;
  sizes?: ItemSize[];
  category_name: string;
  $id: any;
  quantity?: number;
  customizations: CartCustomization[];
  $updatedAt: any;
  $createdAt: any;
}
interface CartItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  rating: number;
  calories: number;
  category_name: string;
  quantity: number;
  sizes: ItemSize[];
  customizations: CartCustomization[];
  uid: string;
}

interface ItemSize {
  $id: any;
  name:
    | "small"
    | "medium"
    | "large"
    | "extra-large"
    | "half"
    | "full"
    | "regular";
  price: number;
  protein: number;
  isDefault: boolean;
  calories: number;
  menuItemId: string;
  isSelected: boolean;
  $createdAt: any;
  $updatedAt: any;
}
export interface CartCustomization {
  icon: string;
  id: string;
  name: string;
  price: number;
  type: string;
  checked: boolean;
}

export interface Coupon {
  code: string;
  discount: number;
}

export interface OrderItem {
  userId: string;
  totalPrice: number;
  discount: number;
  items: string;
  status: "pending" | "preparing" | "delivered" | "cancelled" | "dispatched";
  address: string;
  $createdAt: string;
  $updatedAt: string;
  $id: string;
}

interface CartStore {
  items: CartItemType[];
  index: number;
  addItem: (item: Omit<CartItemType, "quantity">) => void;
  removeItem: (id: string, customizations: CartCustomization[]) => void;
  increaseQty: (id: string, customizations: CartCustomization[]) => void;
  decreaseQty: (id: string, customizations: CartCustomization[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface Address {
  userId: string;
  tag: string;
  icon: string;
  address: string;
  city: string;
}

export interface AddressAppwrite extends Models.Row {
  userId: string;
  tag: string;
  icon: string;
  address: string;
  city: string;
  $id: any;
  $createdAt: any;
  $updatedAt: any;
}

export interface Order extends Models.Row {
  userId: string;
  totalPrice: number;
  status: "pending" | "preparing" | "delivered" | "cancelled" | "dispatched";
  address: string;
  items: string;
  $id: string;
  $updatedAt: string;
  $createdAt: string;
}
