import { Control, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormSelectFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  id: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({
  control,
  name,
  label,
  id,
  options,
  placeholder,
  className = '',
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl className="bg-white">
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
);

export default FormSelectField;
