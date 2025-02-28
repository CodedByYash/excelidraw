interface TextInputProps {
  placeholder?: string;
}

export const TextInput = ({ placeholder }: TextInputProps) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      style={{
        border: "1px solid #ccc",
        padding: "8px",
        borderRadius: "4px",
      }}
    />
  );
};
