import React from 'react';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import { TextField } from './TextField';

interface FormFieldProps<T extends FieldValues> extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  multiline?: boolean;
  password?: boolean;
  /** Message to show; usually `errors[name]?.message`. */
  error?: string;
}

/** react-hook-form binding for TextField. */
export function FormField<T extends FieldValues>({ control, name, label, error, hint, multiline, password, ...rest }: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          {...rest}
          label={label}
          hint={hint}
          error={error}
          multiline={multiline}
          password={password}
          value={(field.value as string | undefined) ?? ''}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
