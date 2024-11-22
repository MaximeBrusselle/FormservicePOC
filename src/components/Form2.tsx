import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from '@nanostores/react';
import { dataReceived, pdfData, hasError, message } from '../PDFstore';

interface Inputs {
    name: string;
    email: string;
    password: string;
    number: number;
}

export function TestForm() {
    const validationSchema = z.object({
        name: z.string().min(1),
        email: z.string().min(1).email(),
        password: z.string().min(1),
        phone: z.string().min(1),
    });

    type SchemaProps = z.infer<typeof validationSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SchemaProps>({
        resolver: zodResolver(validationSchema),
    });

    async function submitForm(formData: SchemaProps) {
        const customerName = formData.name;
        const language = "en-US";
        const dataToSend = {
            [customerName]: formData,
        };
        const response = await fetch("/api/renderPDF", {
            method: "POST",
            body: JSON.stringify(dataToSend),
            
        });
        const data = await response.json();
        dataReceived.set(true);
        pdfData.set(data.pdfBlob);
        hasError.set(response.status !== 200);
        message.set(data.message);
    }

    return (
        <form className="flex flex-col w-[30vw] gap-2 [&_span]:text-red-600 [&_span]:p-2 [&_span]:text-sm [&_label]:text-white" onSubmit={handleSubmit(submitForm)}>
            <div>
                <label htmlFor="name">Name</label>
                {errors?.name && <span>{errors.name.message}</span>}
            </div>
            <input id="name" type="text" {...register("name")} />

            <div>
                <label htmlFor="email">Email</label>
                {errors?.email && <span>{errors.email.message}</span>}
            </div>
            <input id="email" type="email" {...register("email")} />

            <div>
                <label htmlFor="password">Password</label>
                {errors?.password && <span>{errors.password.message}</span>}
            </div>
            <input id="password" type="Password" {...register("password")} />

            <div>
                <label htmlFor="phone">Phone Number</label>
                {errors?.phone && <span>{errors.phone.message}</span>}
            </div>
            <input id="phone" type="string" {...register("phone")} />

            <button type="submit" className="bg-sky-400 rounded-md text-white">
                Enviar
            </button>
        </form>
    );
}
