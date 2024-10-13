import { ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormInputFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  id: string;
  placeholder?: string;
  className?: string;
  children?: ReactNode;
}

const FormInputField: React.FC<FormInputFieldProps> = ({
  control,
  name,
  label,
  id,
  placeholder,
  className = '',
  children,
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={`w-full px-1 ${className}`}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <FormControl className="bg-white">
          <Input {...field} id={id} placeholder={placeholder} />
        </FormControl>
        {children}
      </FormItem>
    )}
  />
);

export default FormInputField;
