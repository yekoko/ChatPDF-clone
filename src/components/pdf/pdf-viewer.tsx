import { Loader } from "lucide-react";

const PdfViewer = ({
  filePath,
  isDeleting,
}: {
  filePath: string;
  isDeleting: boolean;
}) => {
  return (
    <>
      {isDeleting ? (
        <div className="flex flex-row flex-grow justify-center mt-4 w-full h-full items-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <iframe src={filePath} className="w-full h-full border-none"></iframe>
      )}
    </>
  );
};

export default PdfViewer;
