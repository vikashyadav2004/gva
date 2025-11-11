"use client";
import React, { useState } from "react"; 
import {
    Search, 
    Plus,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Modal } from "@/components/ui/modal";
import CreateProtection from "@/components/CustomeForms/CreateProtection";

interface Protection {
    id: number;
    manufacturer: string;
    protectionType: string;
    regReference?: string;
    externalLink?: string;
    designation?: string;
    oePartNo?: string;
}

const allProtections: Protection[] = [
    {
        id: 1,
        manufacturer: "Mercedes-Benz",
        protectionType: "Designschutz",
        designation: "sdjf aserfjhsdfg sdfkjsadf sgkjsdfökljfds",
    },
    { id: 2, manufacturer: "Ford", protectionType: "Sonstige" },
    { id: 3, manufacturer: "Fiat", protectionType: "Sonstige" },
    {
        id: 4,
        manufacturer: "Ford",
        protectionType: "Designschutz",
        designation: "test1",
    },
    {
        id: 5,
        manufacturer: "Opel",
        protectionType: "Sonstige",
        regReference: "cgdsfg",
        designation: "xvxvxvc",
    },
    {
        id: 6,
        manufacturer: "Volkswagen AG",
        protectionType: "Designschutz",
        designation: "dddhjlgfjhlgjfhnd",
    },
];

export default function ProtectionsPage() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    const filtered = allProtections.filter((item) =>
        item.manufacturer.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );
    const [isOpen,setIsOpen] = useState(false)
    return (
        <>
        <div className="p-6">
            {/* Header */}
            <div className="flex gap-3 items-center flex-wrap justify-between mb-5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Protections
                </h2>

                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                    <div className="relative w-full sm:w-[600px] shrink">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search protections..."
                            className="pl-9 pr-4 text-sm border-gray-200 dark:border-gray-800"
                            defaultValue={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Button className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300" onClick={()=>{setIsOpen(true)}}>
                        <Plus size={16} />
                        Create Protection
                    </Button>
                </div>
            </div>

            {/* Table */}
             
            
                <BasicTableOne data={paginated} />
           

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                    variant="outline" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-8 w-8 border-gray-200 disabled:opacity-50"
                >
                    <ChevronLeft size={16} />
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                    <Button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        variant={currentPage === i + 1 ? "primary" : "outline"}
                        className={`h-8 w-8 text-sm ${currentPage === i + 1
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                    >
                        {i + 1}
                    </Button>
                ))}

                <Button
                    variant="outline"  
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 w-8 border-gray-200 disabled:opacity-50"
                >
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
        <Modal  isOpen={isOpen} className="" onClose={()=>{setIsOpen(false)}}>
            <CreateProtection onClose={()=>{setIsOpen(false)}}/>
        </Modal>
        </>
    );
}
