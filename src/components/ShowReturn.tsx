import { useStore } from "@nanostores/react";
import { dataReceived, pdfData, hasError } from "@/PDFstore";

export default function CartFlyout() {
    const $dataReceived = useStore(dataReceived);
    const $data = useStore(pdfData);
    const $hasError = useStore(hasError);

    return (
        <>
            {$dataReceived && !$hasError && (
                <a
                    href={`data:application/pdf;base64,${$data}`}
                    download="download.pdf"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors max-w-[50vw] mx-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download PDF
                </a>
            )}
        </>
    );
}
