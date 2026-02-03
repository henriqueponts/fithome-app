import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WeightScreen from "@/screens/WeightScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type WeightStackParamList = {
  Weight: undefined;
};

const Stack = createNativeStackNavigator<WeightStackParamList>();

export default function WeightStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Weight"
        component={WeightScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
