const ToggleButton = ({
  text,
  state,
  onChange,
}: {
  text: string;
  state: boolean;
  onChange: any;
}) => {
  return (
    <div className="w-fit" onMouseDown={onChange}>
      <label
        htmlFor="toggle"
        className="flex items-center cursor-pointer gap-2"
      >
        <div className="relative">
          <input id="toggle" type="checkbox" className="hidden" />
          <div
            className={`w-12 h-6 relative transition-all duration-300 rounded-full shadow inset-y-0 left-0 ${
              state ? "bg-emerald-500" : "bg-gray-200"
            }`}
          >
            <div
              className={`transition-all left-1 duration-300 absolute bg-white top-1 w-4 h-4 rounded-full shadow transform ${
                state ? "translate-x-[150%]" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">{text}</div>
      </label>
    </div>
  );
};

export default ToggleButton;
