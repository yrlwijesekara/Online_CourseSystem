"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "./utils.js";

function Dialog(props) {
    return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props) {
    return <DialogPrimitive.Trigger {...props} />;
}

function DialogClose(props) {
    return <DialogPrimitive.Close {...props} />;
}

// Darkened overlay with backdrop blur
// Overlay: dark background
function DialogOverlay({ className, ...props }) {
    return (
        <DialogPrimitive.Overlay
            className={cn(
                "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity",
                "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                className
            )}
            {...props}
        />
    );
}

// Content: perfectly centered popup
function DialogContent({ className, children, ...props }) {
    return (
        <DialogPrimitive.Portal>
            {/* Overlay: dark background */}
            <DialogOverlay />
            {/* Content: centered dialog */}
            <DialogPrimitive.Content
                className={cn(
                    "fixed left-1/2 top-1/2 z-[101] w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
                    "rounded-lg bg-white p-6 shadow-2xl focus:outline-none",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute top-4 right-4 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2">
                    <XIcon />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
}
function DialogHeader({ className, ...props }) {
    return (
        <div className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />
    );
}

function DialogFooter({ className, ...props }) {
    return (
        <div
            className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
            {...props}
        />
    );
}

function DialogTitle({ className, ...props }) {
    return <DialogPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} />;
}

function DialogDescription({ className, ...props }) {
    return <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogOverlay,
};