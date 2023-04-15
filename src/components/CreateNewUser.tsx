import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useState } from "react";
import { useUserActions } from "../hooks/useUserActions";

export const CreateNewUser = () => {
	const { addUser } = useUserActions();

	const [status, setStatus] = useState<"ok" | "err" | null>(null);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setStatus(null);
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const github = formData.get("github") as string;

		if (!name || !email || !github) {
			return setStatus("err");
		}

		addUser({ name, email, github });
		setStatus("ok");
		form.reset();
	};

	return (
		<Card className='mt-5'>
			<Title className="mb-4">Create new user</Title>
			<form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
				<TextInput placeholder='name' name="name" />
				<TextInput placeholder='email' name="email" />
				<TextInput placeholder='github user' name="github" />
				<div className="flex gap-5 items-center">
					<Button type='submit'>Create user</Button>
					<span>
						{status === "ok" && <Badge color="emerald">User created</Badge>}
						{status === "err" && <Badge color="red">Error</Badge>}
					</span>
				</div>
			</form>
		</Card>
	);
};
