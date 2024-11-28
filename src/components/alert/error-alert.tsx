import { ShieldAlert } from "lucide-react";

const ErrorAlert = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center">
      <ShieldAlert className="mr-2 text-white" />
      {message}
    </div>
  );
};

export default ErrorAlert;
