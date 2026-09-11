import React from "react";
import {
  Controller,
  Control,
  FieldPath,
  FieldValues,
  ControllerRenderProps,
  Path,
  ControllerFieldState,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FormFieldType } from "../forms/patientForm";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

interface CustomProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  fieldtype: FormFieldType;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

function RenderField<TFieldValues extends FieldValues>({
  field,
  fieldState,
  props,
}: {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  fieldState: ControllerFieldState;
  props: CustomProps<TFieldValues>;
}) {
  const { placeholder, name, fieldtype, iconSrc, iconAlt } = props;
  switch (fieldtype) {
    case FormFieldType.INPUT:
      return (
        <div className="rounded-md flex border border-solid border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt || "icon"}
              width={24}
              height={24}
              className="ml-2"
            />
          )}
          <Input
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete="off"
            className="shad-input border-0"
          />
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          placeholder={placeholder}
          defaultCountry="US"
          international
          withCountryCallingCode
          value={field.value}
          onChange={field.onChange}
          className="input-phone [&_select]:bg-dark-400 [&_select]:text-white"
        />
      );
    default:
      break;
  }
}

function CustomeInput<TFieldValues extends FieldValues>(
  props: CustomProps<TFieldValues>,
) {
  const { control, name, fieldtype, label } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {fieldtype !== FormFieldType.CHECKBOX && label && (
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
          )}
          <RenderField field={field} fieldState={fieldState} props={props} />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className="shad-error" />
          )}
        </Field>
      )}
    />
  );
}

export default CustomeInput;
