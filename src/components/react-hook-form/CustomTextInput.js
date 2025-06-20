// CustomTextInput.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, useTheme } from 'react-native-paper';
import { Controller } from 'react-hook-form'; // Import Controller

/**
 * A custom TextInput component that integrates with react-hook-form.
 * It displays an error message if validation fails.
 *
 * @param {object} props - The component props.
 * @param {object} props.control - The 'control' object from useForm() (required for Controller).
 * @param {string} props.name - The name of the input field (required for Controller and validation).
 * @param {object} props.rules - Validation rules object for react-hook-form (e.g., { required: true, minLength: 6 }).
 * @param {string} props.label - The label for the TextInput.
 * @param {boolean} [props.secureTextEntry=false] - Whether the text input should hide characters.
 * @param {string} [props.keyboardType='default'] - The type of keyboard to display.
 * @param {string} [props.autoCapitalize='none'] - Controls auto-capitalization behavior.
 * @param {boolean} [props.autoCorrect=false] - Controls auto-correction behavior.
 * @param {string} [props.icon] - Icon name for the TextInput.Icon (e.g., "email", "lock").
 * @param {Function} [props.onIconPress] - Function to call when the right icon is pressed.
 * @param {string} [props.rightIcon] - Icon name for the right adornment (e.g., "eye").
 * @param {boolean} [props.isPasswordToggle=false] - Special prop to indicate if it's a password toggle.
 * @param {boolean} [props.passwordVisible=false] - For password toggle, controls visibility.
 * @param {Function} [props.onPasswordToggle] - For password toggle, function to toggle visibility.
 * @param {object} [props.style] - Custom styles for the TextInput component.
 */
const CustomTextInput = ({
  control,
  name,
  rules = {},
  label,
  icon,
  rightIcon,
  isPasswordToggle = false,
  passwordVisible = false,
  onPasswordToggle,
  style,
  ...inputProps // All other standard TextInput props
}) => {
  const theme = useTheme(); // Access the current theme for consistent styling

  return (
    // Controller component from react-hook-form manages input state and validation
    <Controller
      control={control}
      name={name}
      rules={rules} // Apply validation rules
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.inputWrapper}>
          <TextInput
            label={label}
            value={value}
            onChangeText={onChange} // Update form value on text change
            onBlur={onBlur} // Trigger validation on blur
            mode="outlined" // Use outlined mode for a modern look
            style={[styles.textInput, style]} // Apply base and custom styles
            // Apply error prop based on validation result
            error={!!error}
            // Pass through other inputProps like secureTextEntry, keyboardType etc.
            {...inputProps}
            // Left icon adornment
            left={icon ? <TextInput.Icon icon={icon} /> : null}
            // Right icon adornment, especially for password toggle
            right={
              isPasswordToggle ? (
                <TextInput.Icon
                  icon={passwordVisible ? "eye-off" : "eye"} // Toggle eye icon
                  onPress={onPasswordToggle} // Call parent's toggle function
                />
              ) : rightIcon ? (
                <TextInput.Icon icon={rightIcon} />
              ) : null
            }
            // Pass theme colors for TextInput's internal states
            theme={{ colors: { primary: theme.colors.primary, error: theme.colors.error } }}
          />
          {/* Display validation error message if present */}
          {error && (
            <Text style={[styles.errorMessage, { color: theme.colors.error }]}>
              {error.message || `${label} is invalid.`}
            </Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 15, // Consistent spacing below each input block
  },
  textInput: {
    // Styles for the TextInput itself can be minimal as Paper handles much
  },
  errorMessage: {
    marginTop: 4, // Space between input and error message
    fontSize: 12, // Smaller font for error messages
  },
});

export default CustomTextInput;

