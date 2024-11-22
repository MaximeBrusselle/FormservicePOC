import { atom } from "nanostores";

export const dataReceived = atom(false);
export const pdfData = atom("");
export const hasError = atom(false);
export const bearerToken = atom("");
export const expiresIn = atom(0);
export const accessedAt = atom(0);
