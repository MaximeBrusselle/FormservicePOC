import { useStore } from "@nanostores/react";
import { dataReceived, pdfData, hasError, message } from "../PDFstore";

export default function CartFlyout() {
    const $dataReceived = useStore(dataReceived);
    const $data = useStore(pdfData);
    const $hasError = useStore(hasError);
    const $message = useStore(message);

    return (
        <>
            {$dataReceived && !$hasError ? (
                <a
                    href={`data:application/pdf;base64,${$data}`}
                    download="download.pdf"
                    className="text-white"
                >
                    Download PDF
                </a>
            ) : (
                <div
                    className={
                        $dataReceived && !$hasError
                            ? "text-green-500 border-green-500 bg-green-100"
                            : "text-red-500 border-red-500 bg-red-100"
                    }
                >
                    {$message}
                    {$data}
                </div>
            )}
        </>
    );
}
