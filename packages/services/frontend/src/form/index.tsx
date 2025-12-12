import {
  FormProvider as ReactFormProvider,
  useForm as useReactForm,
  useFormContext,
  type FieldValues,
  type PathValue,
  type DefaultValues,
  Controller,
  ControllerRenderProps,
  type ControllerFieldState,
  type FieldPath,
  RegisterOptions,
} from 'react-hook-form';
import { type ReactNode } from 'react';

export const FormProvider = <T extends FieldValues>({
  children,
  defaultValues,
}: {
  children: ReactNode;
  defaultValues?: DefaultValues<T>;
}) => {
  const methods = useReactForm<T>({
    defaultValues,
    mode: 'onChange',
  });
  return <ReactFormProvider {...methods}>{children}</ReactFormProvider>;
};

export const Field = <FieldValues, FieldName extends FieldPath<FieldValues>>({
  name,
  render,
  rules,
}: {
  name: FieldName;
  rules?: RegisterOptions<FieldValues, FieldName>;
  render: (props: {
    field: {
      value: ControllerRenderProps<FieldValues, FieldName>['value'];
      onChange: (value: PathValue<FieldValues, FieldName>) => void;
    };
    fieldState: Omit<ControllerFieldState, 'error'> & {
      isRequired: boolean;
      error?: { message: string; type: string };
    };
  }) => React.ReactElement;
}) => {
  const { control } = useFormContext<FieldValues>();
  const isRequired = Boolean(rules?.required);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) =>
        render({
          field,
          fieldState: {
            ...fieldState,
            isRequired,
            error: fieldState.error && {
              message: fieldState.error.message,
              type: fieldState.error.type,
            },
          },
        })
      }
    />
  );
};

export const useForm = <T extends FieldValues>() => {
  const context = useFormContext<T>();

  const valiatedField = (field: FieldPath<T>) => {
    const { getFieldState } = context;
  };

  return context;
};
