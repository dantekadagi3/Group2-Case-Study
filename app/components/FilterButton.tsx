


type FilterButtonProps = {
  isActive: boolean;
  onClick: () => void;
  label: string;
};

const FilterButton: React.FC<FilterButtonProps> = ({ isActive, onClick, label }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        isActive ? 'bg-sky-400 text-white' : "bg-white/10 backdrop-blur-md border border-white/20 text-white"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
export default FilterButton;