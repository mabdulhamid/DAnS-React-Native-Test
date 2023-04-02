import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/Login";
import JobListScreen from "./screens/List";
import JobDetailScreen from "./screens/Detail";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="JobListScreen" component={JobListScreen} />
        <Stack.Screen
          name="JobDetailScreen"
          component={JobDetailScreen}
          options={{ headerTitle: "Job Details" }}
          mode="modal"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
