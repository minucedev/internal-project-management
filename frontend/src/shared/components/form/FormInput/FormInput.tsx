import { type UseFormRegister, type FieldErrors, type Path, type FieldValues } from 'react-hook-form';
import { Input, type InputProps } from '../../ui/Input';

// We use a generic type T for FieldValues to ensure type safety with the form data
export interface FormInputProps<T extends FieldValues> extends Omit<InputProps, 'name'> {
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const FormInput = <T extends FieldValues>({
  name,
  register,
  errors,
  ...props
}: FormInputProps<T>) => {
  // Extract error message safely
  // Note: This simple extraction works for flat structures. 
  // For deeply nested errors, you might need lodash.get or similar.
  const error = errors[name]?.message as string | undefined;

  return (
    <Input
      {...register(name)}
      error={error}
      {...props}
    />
  );
};
