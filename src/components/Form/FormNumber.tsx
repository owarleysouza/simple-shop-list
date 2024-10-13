import { Control, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormNumberFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  id: string;
  placeholder?: string;
  className?: string;
}

const FormNumberField: React.FC<FormNumberFieldProps> = ({
  control,
  name,
  label,
  id,
  placeholder,
  className = '',
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <FormControl className="bg-white">
          <Input {...field} id={id} type="number" placeholder={placeholder} />
        </FormControl>
      </FormItem>
    )}
  />
);

export default FormNumberField;
