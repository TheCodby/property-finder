import "@/styles/loading-spinner.css";
function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
