import React from 'react';
import InputMask from 'react-input-mask';
import { Input } from 'rsuite';

const CurrencyInput: React.FC<{ value: number; onChange: (value: number) => void; [key: string]: any }> = ({ value, onChange, ...props }) => {
    const handleChange = (rawValue: string) => {
        const numericValue = parseFloat(rawValue.replace(/[^\d]/g, '')) / 100;
        onChange(numericValue);
    };

    const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value || 0);

    return (
        <InputMask
            mask="R$ 999.999.999,99"
            value={formattedValue}
            onChange={(e) => handleChange(e.target.value)}
            {...props}
        >
            <Input />
        </InputMask>
    );
};

export default CurrencyInput;
