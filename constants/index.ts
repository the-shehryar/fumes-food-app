import appLogo from "@/assets/images/applogo.png";
import burgerBackground from "@/assets/images/Background-Dry.png";
import cakeTransparent from "@/assets/images/cake-Transparent.png";
import chineeseOffer from "@/assets/images/chineese-offer.png";
import coffeeOffer from "@/assets/images/coffee-offer.png";
import pizzaOffer from "@/assets/images/pizza-offer.png";
import pizzaTransparent from "@/assets/images/pizza-transparent.png";
import riceTransparent from "@/assets/images/rice-Transparent.png";
import sandwichBackground from "@/assets/images/sandwich-bg.png";
import sandwichOffer from "@/assets/images/sandwich-offer.png";
import burgerTransparent from "@/assets/images/transparent-burger-extra.png";

export const images = {
  burgerTransparent,
  riceTransparent,
  cakeTransparent,
  pizzaTransparent,
  sandwichBackground,
  appLogo,
  burgerBackground,
};

export let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export let passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export let upperCaseCheckRegex = /(?=.*[A-Z])/;
export let lowerCaseCheckRegex = /(?=.*[a-z])/;
export let numberCheckRegex = /(?=.*\d)/;
export let specialCharacterCheckRegex = /(?=.*[@$!%*^?&])/;

export const Offers = [
  {
    tag : "Healthy",
    id: 1,
    name: "A Dream Sandwich",
    color: "#730C02",
    image: sandwichOffer,
    description:
      "Layered fillings between slices of fresh soft bread.",
  },
  {
    tag : "Cravings",
    id: 2,
    name: "Cheeezzy Pizza",
    color: "#2C4031",
    image: pizzaOffer,
    description:
      "Cheesy baked flatbread with tomato sauce and toppings.",
  },
  {
    tag : "Sweet Tooth",
    id: 3,
    name: "Sweet Delight",
    color: "#da9138",
    image: coffeeOffer,
    description: "Rich, aromatic beverage providing bold flavor and energy.",
  },
  {
    tag : "Asian",
    id: 4,
    name: "Want Some Chineese",
    color: "#A64E1B",
    image: chineeseOffer,
    description : "Stir-fried vegetables, meat, noodles with savory sauces."
  },
];
