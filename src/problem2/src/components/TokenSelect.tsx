import React from "react";
import Select from "react-select";

type TokenSelectProps = {
  tokens: string[];
  value: string;
  onChange: (token: string) => void;
  label: string;
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    padding: "4px",
    fontSize: "15px",
  }),
  option: (provided: any) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#000",
  }),
};

export const TokenSelect: React.FC<TokenSelectProps> = ({
  tokens,
  value,
  onChange,
  label,
}) => {
  const options = tokens.map((t) => ({ value: t, label: t }));

  return (
    <div className="token-select">
      <label>{label}</label>
      <Select
        options={options}
        value={options.find((option) => option.value === value)}
        onChange={(selected) => selected && onChange(selected.value)}
        styles={customStyles}
        formatOptionLabel={({ value }) => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src={`/src/assets/tokens/${value}.svg`}
              alt={value}
              width="20"
              height="20"
            />
            {value}
          </div>
        )}
      />
    </div>
  );
};
