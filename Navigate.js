import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./src/screens/Main";
import CharacterDetails from "./src/screens/CharacterDetails";
import ListOfCharacters from "./src/screens/ListOfCharacters";
import Login from "./src/screens/Login";
import AppearanceDetails from "./src/screens/AppearanceDetails";

const Stack = createStackNavigator();

const mainOptions = {
  headerStyle: {
    backgroundColor: "#afdccb",
    height: 90,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    fontWeight: "bold",
    color: "#000000",
    fontSize: 24,
    alignSelf: "center",
  },
  headerLeftContainerStyle: {
    paddingLeft: 5,
  },
  headerRightContainerStyle: {
    paddingRight: 5,
  },
  headerTitleAlign: "center",
  headerTintColor: "#000000",
};

const characterOptions = {
  headerShown: false,
};

export default function Navigate() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={characterOptions}
        />
        <Stack.Screen name="Main" component={Main} options={mainOptions} />
        <Stack.Screen
          name="CharacterDetails"
          component={CharacterDetails}
          options={mainOptions}
        />
        <Stack.Screen
          name="ListOfCharacters"
          component={ListOfCharacters}
          options={mainOptions}
        />
        <Stack.Screen name="AppearanceDetails"
                      component={AppearanceDetails}
                      options={characterOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
