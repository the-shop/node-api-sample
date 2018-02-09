import {
  white,
  grey100,
  teal700,
  deepOrange700,
  deepOrange900,
  darkBlack,
  faintBlack,
  fullBlack,
  blueGrey200,
  blueGrey600,
  blueGrey800,
} from "material-ui/styles/colors";
import { fade } from "material-ui/utils/colorManipulator";

const lightTextColor = grey100;

export default {
  fontFamily: "Roboto, sans-serif",
  palette: {
    primary1Color: teal700,
    primary2Color: blueGrey800,
    primary3Color: blueGrey200,
    accent1Color: deepOrange700,
    accent2Color: white,
    accent3Color: deepOrange900,
    textColor: darkBlack,
    secondaryTextColor: fade( darkBlack, 0.54 ),
    alternateTextColor: lightTextColor,
    canvasColor: white,
    borderColor: faintBlack,
    disabledColor: fade( darkBlack, 0.3 ),
    pickerHeaderColor: deepOrange700,
    clockCircleColor: fade( darkBlack, 0.07 ),
    shadowColor: fullBlack
  },
  appBar: {
    color: blueGrey800,
    textColor: lightTextColor,
    height: 64,
    titleFontWeight: 400,
    padding: 24
  },
  sidebar: {
    main: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      backgroundColor: blueGrey600,
      height: "100%",
    },
    narrow: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      backgroundColor: blueGrey600,
      minHeight: "100vh"
    },
    menuItem: {
      color: lightTextColor,
      fill: lightTextColor
    }
  },
  chip: {
    backgroundColor: blueGrey600,
    deleteIconColor: lightTextColor,
    textColor: lightTextColor,
    fontSize: 14,
    fontWeight: 400,
    shadow: 0
  },
};
