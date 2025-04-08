import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function EmptySummaryState() {
    return (
        <div className="text-center py-12">
            <div className="flex flex-col gap-4 items-center">
                <FileText className="h-16 w-16 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-600">
                    No summary yet!
                </h2>
                <p className="text-gray-500 max-w-md">Upload your first PDF to get started with AI-Powered summaries.</p>
                <Link href="/upload">
                    <Button  variant={"link"} className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 hover:no-underline">
                        <Link href="/upload" className="flex text-white items-center"> Create New Summary
                        </Link>
                    </Button>
                </Link>
            </div>
        </div>
    )
}