interface InputFieldProps {
    icon?: React.ReactNode;
    label: string;
    name: string;
    type: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}


export default InputFieldProps;