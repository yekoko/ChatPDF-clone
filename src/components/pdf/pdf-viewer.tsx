const PdfViewer = ({ filePath }: { filePath: string }) => {
  return <iframe src={filePath} className="w-full h-full border-none"></iframe>;
};

export default PdfViewer;
