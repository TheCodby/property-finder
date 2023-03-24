const ErrorBox = ({ error }: { error: string }) => {
  return (
    <div className="text-center p-5 bg-red-300 text-red-700 font-bold card text-xl">
      <p>{error}</p>
    </div>
  );
};

export default ErrorBox;
