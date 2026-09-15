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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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
  const {
    placeholder,
    name,
    fieldtype,
    iconSrc,
    iconAlt,
    renderSkeleton,
    label,
    showTimeSelect,
  } = props;
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
    case FormFieldType.DATA_PICKER:
      return (
        <div className="mx-auto flex flex-row gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker-simple"
                className="rounded-md h-11! border border-solid border-dark-500 bg-dark-400! justify-start"
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <div className="flex items-center">
                    <Image
                      src="/assets/icons/calendar.svg"
                      height={24}
                      width={24}
                      alt="celender"
                      className="mr-2"
                    />
                    <span>pick a date</span>
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => field.onChange(date)}
                defaultMonth={field.value}
                className="bg-dark-400!"
              />
            </PopoverContent>
          </Popover>
          {showTimeSelect && (
            <Field className="w-32">
              <Input
                type="time"
                id="time-picker-optional"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none rounded-md h-11! border border-solid border-dark-500 bg-dark-400! [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </Field>
          )}
        </div>
      );
    case FormFieldType.SKELETON:
      return <div>{renderSkeleton ? renderSkeleton(field) : null}</div>;
    case FormFieldType.SELECT:
      return (
        <Select
          value={field.value}
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <SelectTrigger className="shad-select-trigger">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-dark-400">
            <SelectGroup>{props.children}</SelectGroup>
          </SelectContent>
        </Select>
      );
    case FormFieldType.TEXTAREA:
      return (
        <Textarea
          placeholder={placeholder}
          {...field}
          className="shad-textArea"
          disabled={props.disabled}
        />
      );
    case FormFieldType.CHECKBOX:
      return (
        <div className="flex items-center gap-4">
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <label htmlFor={name}>{label}</label>
        </div>
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
