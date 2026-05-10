import { FieldError, Input, Label, TextField } from "@heroui/react";

interface FormTextFieldProps {
  label: string;
  name: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  isRequired?: boolean;
  min?: number | string;
  step?: number | string;
  onChange?: (value: string) => void;
  className?: string;
}

export function FormTextField({
  label,
  name,
  value,
  defaultValue,
  placeholder,
  type = "text",
  isRequired = false,
  min,
  step,
  onChange,
  className = "",
}: FormTextFieldProps) {
  return (
    <TextField
      name={name}
      type={type}
      isRequired={isRequired}
      className={className}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      <Label>{label}</Label>
      <Input
        placeholder={placeholder}
        variant="secondary"
        min={min}
        step={step}
      />
      <FieldError />
    </TextField>
  );
}
