import { FieldError, Label, ListBox, Select } from "@heroui/react";

interface SelectOption {
  key: string;
  label: string;
}

interface FormSelectFieldProps {
  label: string;
  name: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  options: SelectOption[];
  isRequired?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

export function FormSelectField({
  label,
  name,
  value,
  defaultValue,
  placeholder = "Select an option",
  options,
  isRequired = false,
  onChange,
  className = "",
}: FormSelectFieldProps) {
  return (
    <Select
      name={name}
      isRequired={isRequired}
      className={className}
      value={value}
      defaultSelectedKey={defaultValue || undefined}
      onChange={(val) => onChange?.(val as string)}
      placeholder={placeholder}
      variant="secondary"
    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.key} id={option.key} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      <FieldError />
    </Select>
  );
}
