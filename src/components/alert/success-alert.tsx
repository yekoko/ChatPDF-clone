import { CircleCheck } from "lucide-react";

const SuccessAlert = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center">
      <CircleCheck className="mr-2 text-green-500" />
      {message}
    </div>
  );
};

export default SuccessAlert;
