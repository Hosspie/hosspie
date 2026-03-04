import {
  FormProvider as ReactFormProvider,
  useForm as useReactForm,
  useFormContext,
  type FieldValues,
  type PathValue,
  type DefaultValues,
  Controller,
  type ControllerRenderProps,
  type ControllerFieldState,
  type FieldPath,
  type RegisterOptions,
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

export const Field = <
  TFieldValues extends FieldValues,
  FieldName extends FieldPath<TFieldValues>,
>({
  name,
  render,
  rules,
}: {
  name: FieldName;
  rules?: RegisterOptions<TFieldValues, FieldName>;
  render: (props: {
    field: {
      value: ControllerRenderProps<TFieldValues, FieldName>['value'];
      onChange: (value: PathValue<TFieldValues, FieldName>) => void;
    };
    fieldState: Omit<ControllerFieldState, 'error'> & {
      isRequired: boolean;
      error?: { message: string; type: string };
    };
  }) => React.ReactElement;
}) => {
  const { control } = useFormContext<TFieldValues>();
  const isRequired = Boolean(rules?.required);

  return (
    <Controller
      control={control as any}
      name={name as any}
      rules={rules as any}
      render={({ field, fieldState }) =>
        render({
          field: field as any,
          fieldState: {
            ...fieldState,
            isRequired,
            error: fieldState.error
              ? {
                  message: fieldState.error.message ?? '',
                  type: fieldState.error.type,
                }
              : undefined,
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
