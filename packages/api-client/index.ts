import { treaty } from '@elysiajs/eden';
import type { App } from 'backend';

const url = () => {
    if (process.env.NODE_ENV === "production") return process.env["API_URL"]!;
    return "http://localhost:3000"
}

export const pnsClient = treaty<App>(url());
