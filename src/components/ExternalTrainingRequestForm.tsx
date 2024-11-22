import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { dataReceived, pdfData, hasError } from "@/PDFstore";
import type { FormData } from "@/types/FormData";
import toast, { Toaster } from "react-hot-toast";
import type { CustomerData } from "@/types/Customer";

interface TestFormProps {
	customerData: CustomerData;
	formData: FormData;
}

export function ExternalTrainingRequestForm({ customerData, formData }: TestFormProps) {
	const validationSchema = z.object({
		participant: z.string().min(1),
		createdOn: z.string().date().default(new Date().toISOString().split("T")[0]).optional(),
		courseType: z.string().min(1),
		courseName: z.string().min(1),
		courseCost: z.number().min(0),
		costCurrency: z.string().min(1),
		onlyStartEndDates: z.boolean().default(true).optional(),
		courseStartDate: z.string().date().optional(),
		courseEndDate: z.string().date().optional(),
		durationDays: z.number().optional(),
		durationHours: z.number().optional(),
		schoolName: z.string().min(1),
		otherSchoolName: z.string().optional(),
		programme: z.string().min(1),
		otherProgramme: z.string().optional(),
		grantCertificate: z.boolean(),
		SAQCode: z.string().optional(),
		courseTheme: z.string().min(1),
		contribution: z.number().optional(),
		allocatedWorkdays: z.number().optional(),
		comment: z.string().max(700).optional(),
		readAndAccepted: z.boolean(),
		attachments: z.array(z.string()).optional(),
		securityDomain: z.string().min(1),
		attendanceEmail: z.boolean(),
		additionalComment: z.string().max(700).optional(),
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			createdOn: new Date().toISOString().split("T")[0],
		},
	});

	async function submitForm(formData: FormData) {
		const toastId = toast.loading("Processing your request...");
		try {
			const dataToSend = {
				language: navigator.language,
				customerData,
				formData: {
					[customerData.name]: formData,
				},
			};

			const response = await fetch("/api/renderPDF", {
				method: "POST",
				body: JSON.stringify(dataToSend),
			});
			const data = await response.json();
			dataReceived.set(true);
			pdfData.set(data.pdfBlob);
			hasError.set(response.status !== 200);
			window.scrollTo({ top: 0, behavior: 'smooth' });

			if (response.status === 200) {
				toast.success(data.message, { id: toastId });
			} else {
				toast.error(data.message, { id: toastId });
			}
		} catch (error) {
			toast.error("An error occurred while processing your request", {
				id: toastId,
			});
		}
	}

	async function fillFormData() {
		try {
			if (formData) {
				reset(formData);
				toast.success("Form data loaded successfully");
			}
		} catch (error) {
			toast.error("Error loading form data");
		}
	}

	return (
		<form
			className="flex flex-col w-full max-w-[50vw] mx-auto p-6 space-y-8 bg-base-200 rounded-lg shadow-xl [&_span.error]:text-error [&_span.error]:text-sm [&_span.label-text]:text-white [&_input]:text-gray-100 [&_select]:text-gray-100 [&_textarea]:text-gray-100 relative"
			onSubmit={handleSubmit(submitForm, (errors) => {
				if (Object.keys(errors).length > 0) {
					toast.error("Please fill in all required fields correctly");
				}
			})}
		>
			{/* PARTICIPANT */}
			<div className="border-b-2 border-gray-700 pb-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-base-content">
						Participant
					</h2>
					<button
						type="button"
						onClick={fillFormData}
						className="btn bg-indigo-700 hover:bg-indigo-600 text-white border-none"
					>
						Fill in data
					</button>
				</div>
				<div className="form-control space-y-3">
					<label htmlFor="participant" className="label">
						<span className="label-text text-base-content text-lg">
							Request for user{" "}
							<span className="text-error">*</span>
						</span>
					</label>
					{errors?.participant && (
						<span className="error">
							{errors.participant.message}
						</span>
					)}
					<select
						id="participant"
						{...register("participant")}
						className="select select-bordered w-full"
					>
						<option value="">Select a participant</option>
						<option value="John Doe">John Doe</option>
						<option value="Jane Smith">Jane Smith</option>
						<option value="Bob Wilson">Bob Wilson</option>
						<option value="Alice Brown">Alice Brown</option>
					</select>
				</div>
			</div>

			{/* REQUEST DETAILS */}
			<div className="border-b-2 border-gray-700 pb-6">
				<h2 className="text-2xl font-bold mb-6 text-base-content">
					Request Details
				</h2>

				<div className="form-control space-y-3">
					<label htmlFor="createdOn" className="label">
						<span className="label-text text-base-content text-lg">
							Created On <span className="text-error">*</span>
						</span>
					</label>
					{errors?.createdOn && (
						<span className="error">
							{errors.createdOn.message}
						</span>
					)}
					<input
						id="createdOn"
						type="text"
						{...register("createdOn")}
						className="input input-bordered w-full"
						disabled
						value={new Date().toLocaleDateString("en-GB", {
							day: "2-digit",
							month: "long",
							year: "numeric",
						})}
					/>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="courseType" className="label">
						<span className="label-text text-base-content text-lg">
							Course / Programme / Event type{" "}
							<span className="text-error">*</span>
						</span>
					</label>
					{errors?.courseType && (
						<span className="error">
							{errors.courseType.message}
						</span>
					)}
					<input
						id="courseType"
						type="text"
						{...register("courseType")}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="courseName" className="label">
						<span className="label-text text-base-content text-lg">
							Course / Programme / Event name{" "}
							<span className="text-error">*</span>
						</span>
					</label>
					{errors?.courseName && (
						<span className="error">
							{errors.courseName.message}
						</span>
					)}
					<input
						id="courseName"
						type="text"
						{...register("courseName")}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="grid grid-cols-2 gap-6 mt-4">
					<div className="form-control space-y-3">
						<label htmlFor="courseCost" className="label">
							<span className="label-text text-base-content text-lg">
								Course / Programme / Event cost per participant{" "}
								<span className="text-error">*</span>
							</span>
						</label>
						{errors?.courseCost && (
							<span className="error">
								{errors.courseCost.message}
							</span>
						)}
						<input
							id="courseCost"
							type="number"
							{...register("courseCost", { valueAsNumber: true })}
							className="input input-bordered w-full"
						/>
					</div>

					<div className="form-control space-y-3">
						<label htmlFor="costCurrency" className="label">
							<span className="label-text text-base-content text-lg">
								Currency <span className="text-error">*</span>
							</span>
						</label>
						{errors?.costCurrency && (
							<span className="error">
								{errors.costCurrency.message}
							</span>
						)}
						<input
							id="costCurrency"
							type="text"
							{...register("costCurrency")}
							className="input input-bordered w-full"
						/>
					</div>
				</div>

				<div className="form-control mt-4">
					<label className="label cursor-pointer">
						<span className="label-text text-base-content text-lg">
							Only use start/end date
						</span>
						<input
							type="checkbox"
							{...register("onlyStartEndDates")}
							className="checkbox checkbox-primary"
							defaultChecked
							disabled
						/>
					</label>
				</div>

				<div className="grid grid-cols-2 gap-6 mt-4">
					<div className="form-control space-y-3">
						<label htmlFor="courseStartDate" className="label">
							<span className="label-text text-base-content text-lg">
								Course / Programme / Event start date
							</span>
						</label>
						{errors?.courseStartDate && (
							<span className="error">
								{errors.courseStartDate.message}
							</span>
						)}
						<input
							id="courseStartDate"
							type="date"
							{...register("courseStartDate")}
							className="input input-bordered w-full"
						/>
					</div>

					<div className="form-control space-y-3">
						<label htmlFor="courseEndDate" className="label">
							<span className="label-text text-base-content text-lg">
								Course / Programme / Event end date
							</span>
						</label>
						{errors?.courseEndDate && (
							<span className="error">
								{errors.courseEndDate.message}
							</span>
						)}
						<input
							id="courseEndDate"
							type="date"
							{...register("courseEndDate")}
							className="input input-bordered w-full"
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-6 mt-4">
					<div className="form-control space-y-3">
						<label htmlFor="durationDays" className="label">
							<span className="label-text text-base-content text-lg">
								Duration in days (total)
							</span>
						</label>
						{errors?.durationDays && (
							<span className="error">
								{errors.durationDays.message}
							</span>
						)}
						<input
							id="durationDays"
							type="number"
							{...register("durationDays", {
								valueAsNumber: true,
							})}
							className="input input-bordered w-full"
						/>
					</div>

					<div className="form-control space-y-3">
						<label htmlFor="durationHours" className="label">
							<span className="label-text text-base-content text-lg">
								Duration in hours (total)
							</span>
						</label>
						{errors?.durationHours && (
							<span className="error">
								{errors.durationHours.message}
							</span>
						)}
						<input
							id="durationHours"
							type="number"
							{...register("durationHours", {
								valueAsNumber: true,
							})}
							className="input input-bordered w-full"
						/>
					</div>
				</div>
				<div className="form-control space-y-3 mt-4">
					<label className="label">
						<span className="label-text text-base-content text-lg">
							School / Provider List
						</span>
					</label>
					<a
						href="https://example.com/school-provider-list"
						className="link link-primary"
					>
						https://example.com/school-provider-list
					</a>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="schoolName" className="label">
						<span className="label-text text-base-content text-lg">
							School / Provider name{" "}
							<span className="text-error">*</span>
						</span>
					</label>
					{errors?.schoolName && (
						<span className="error">
							{errors.schoolName.message}
						</span>
					)}
					<input
						id="schoolName"
						type="text"
						{...register("schoolName")}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="otherSchoolName" className="label">
						<span className="label-text text-base-content text-lg">
							Other School / Provider name
						</span>
					</label>
					{errors?.otherSchoolName && (
						<span className="error">
							{errors.otherSchoolName.message}
						</span>
					)}
					<input
						id="otherSchoolName"
						type="text"
						{...register("otherSchoolName")}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="programme" className="label">
						<span className="label-text text-base-content text-lg">
							Programme / Course{" "}
							<span className="text-error">*</span>
						</span>
					</label>
					{errors?.programme && (
						<span className="error">
							{errors.programme.message}
						</span>
					)}
					<input
						id="programme"
						type="text"
						{...register("programme")}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="otherProgramme" className="label">
						<span className="label-text text-base-content text-lg">
							Other Programme / Course
						</span>
					</label>
					{errors?.otherProgramme && (
						<span className="error">
							{errors.otherProgramme.message}
						</span>
					)}
					<input
						id="otherProgramme"
						type="text"
						{...register("otherProgramme")}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control mt-4">
					<label className="label cursor-pointer">
						<span className="label-text text-base-content text-lg">
							Grants a professional certification
						</span>
						<input
							type="checkbox"
							{...register("grantCertificate")}
							className="checkbox checkbox-primary"
						/>
					</label>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="SAQCode" className="label">
						<span className="label-text text-base-content text-lg">
							SAQ Code
						</span>
					</label>
					{errors?.SAQCode && (
						<span className="error">{errors.SAQCode.message}</span>
					)}
					<input
						id="SAQCode"
						type="text"
						{...register("SAQCode")}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="courseTheme" className="label">
						<span className="label-text text-base-content text-lg">
							Course Theme <span className="text-error">*</span>
						</span>
					</label>
					{errors?.courseTheme && (
						<span className="error">
							{errors.courseTheme.message}
						</span>
					)}
					<input
						id="courseTheme"
						type="text"
						{...register("courseTheme")}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="grid grid-cols-2 gap-6 mt-4">
					<div className="form-control space-y-3">
						<label htmlFor="contribution" className="label">
							<span className="label-text text-base-content text-lg">
								% of contribution
							</span>
						</label>
						{errors?.contribution && (
							<span className="error">
								{errors.contribution.message}
							</span>
						)}
						<input
							id="contribution"
							type="number"
							{...register("contribution", {
								valueAsNumber: true,
							})}
							className="input input-bordered w-full"
						/>
					</div>

					<div className="form-control space-y-3">
						<label htmlFor="allocatedWorkdays" className="label">
							<span className="label-text text-base-content text-lg">
								# of working days allocated for exam preparation
							</span>
						</label>
						{errors?.allocatedWorkdays && (
							<span className="error">
								{errors.allocatedWorkdays.message}
							</span>
						)}
						<input
							id="allocatedWorkdays"
							type="number"
							{...register("allocatedWorkdays", {
								valueAsNumber: true,
							})}
							className="input input-bordered w-full"
						/>
					</div>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="comment" className="label">
						<span className="label-text text-base-content text-lg">
							Comment
						</span>
					</label>
					{errors?.comment && (
						<span className="error">{errors.comment.message}</span>
					)}
					<div className="relative">
						<textarea
							id="comment"
							{...register("comment", {
								onChange: (e) => {
									const remaining =
										700 - e.target.value.length;
									e.target.nextElementSibling.textContent = `${remaining} characters remaining`;
								},
							})}
							className="textarea textarea-bordered h-24 w-full"
						/>
						<span className="absolute bottom-2 right-2 text-sm text-base-content">
							700 characters remaining
						</span>
					</div>
				</div>
			</div>

			{/* TRAINING AGREEMENT */}
			<div className="border-b-2 border-gray-700 pb-6">
				<h2 className="text-2xl font-bold mb-6 text-base-content">
					Training Agreement
				</h2>

				<div className="space-y-3 mb-6">
					<div>
						<span className="mr-2">1)</span>
						<a
							href="https://training-policy.com"
							className="link link-primary"
						>
							External Training Guidelines
						</a>
					</div>
					<div>
						<span className="mr-2">2)</span>
						<a
							href="https://terms-conditions.com"
							className="link link-primary"
						>
							Directives Training External
						</a>
					</div>
					<div>
						<span className="mr-2">3)</span>
						<a
							href="https://privacy-policy.com"
							className="link link-primary"
						>
							External training agreement
						</a>
					</div>
					<div>
						<span className="mr-2">4)</span>
						<a
							href="https://code-conduct.com"
							className="link link-primary"
						>
							Convention of external formation
						</a>
					</div>
				</div>

				<div className="form-control">
					<label className="label cursor-pointer">
						<span className="label-text text-base-content text-lg">
							I have read and accepted all terms{" "}
							<span className="text-error">*</span>
						</span>
						<input
							type="checkbox"
							{...register("readAndAccepted")}
							className="checkbox checkbox-primary"
						/>
					</label>
				</div>
			</div>

			{/* ATTACHMENTS */}
			<div className="border-b-2 border-gray-700 pb-6">
				<h2 className="text-2xl font-bold mb-6 text-base-content">
					Attachments
				</h2>
				{/* Note: You'll need to implement file upload functionality here */}
				<div className="form-control space-y-3">
					<label htmlFor="attachments" className="label">
						<span className="label-text text-base-content text-lg">
							Upload Documents
						</span>
					</label>
					{errors?.attachments && (
						<span className="error">
							{errors.attachments.message}
						</span>
					)}
					<input
						id="attachments"
						type="file"
						multiple
						className="file-input file-input-bordered w-full"
					/>
				</div>
			</div>

			{/* TRAINING ADMIN */}
			<div className="border-b-2 border-gray-700 pb-6">
				<h2 className="text-2xl font-bold mb-6 text-base-content">
					Training Admin
				</h2>

				<div className="form-control space-y-3">
					<label htmlFor="securityDomain" className="label">
						<span className="label-text text-base-content text-lg">
							Security Domain{" "}
							<span className="text-error">*</span>
						</span>
					</label>
					{errors?.securityDomain && (
						<span className="error">
							{errors.securityDomain.message}
						</span>
					)}
					<input
						id="securityDomain"
						type="text"
						{...register("securityDomain")}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control mt-4">
					<label className="label cursor-pointer">
						<span className="label-text text-base-content text-lg">
							Attendance Email
						</span>
						<input
							type="checkbox"
							{...register("attendanceEmail")}
							className="checkbox checkbox-primary"
						/>
					</label>
				</div>

				<div className="form-control space-y-3 mt-4">
					<label htmlFor="additionalComment" className="label">
						<span className="label-text text-base-content text-lg">
							Additional Comment
						</span>
					</label>
					{errors?.additionalComment && (
						<span className="error">
							{errors.additionalComment.message}
						</span>
					)}
					<div className="relative">
						<textarea
							id="additionalComment"
							{...register("additionalComment", {
								onChange: (e) => {
									const remaining =
										700 - e.target.value.length;
									e.target.nextElementSibling.textContent = `${remaining} characters remaining`;
								},
							})}
							className="textarea textarea-bordered h-24 w-full"
						/>
						<span className="absolute bottom-2 right-2 text-sm text-base-content">
							700 characters remaining
						</span>
					</div>
				</div>
			</div>

			<button type="submit" className="btn btn-primary w-full text-white">
				Submit
			</button>
			<Toaster />
		</form>
	);
}
