import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userReducer, {
	User,
	UserID,
	UserWithId,
	rollbackAddUser,
	rollbackRemoveUser,
} from "./users/slice";

const persistanceLocalStorageMiddleware: Middleware =
	(store) => (next) => (action) => {
		// console.log(store.getState());
		// console.log(action);
		next(action);
		// console.log(store.getState());
		localStorage.setItem("redux_state", JSON.stringify(store.getState()));
	};

const syncWithDataBaseMiddleware: Middleware =
	(store) => (next) => (action) => {
		const { type, payload } = action;
		const previousState = store.getState();

		console.log(previousState, "previousState");
		next(action);

		const nextState = store.getState();
		console.log(nextState, "nextState");

		if (type === "users/deleteUserById") {
			const userIdToRemove: UserID = payload;
			const userToRemove = previousState.users.find(
				(user: UserWithId) => user.id === userIdToRemove,
			);

			fetch("https://jsonplaceholder.typicode.com/users/${payload}", {
				method: "DELETE",
			})
				.then((res) => {
					if (res.ok) {
						toast.success(`User ${userIdToRemove} deleted`);
					}
				})
				.catch((err) => {
					toast.error(`Error deleting user ${userIdToRemove}`);
					if (userToRemove) store.dispatch(rollbackRemoveUser(userToRemove));
					console.error(err);
				});
		}

		if (type === "users/addNewUser") {
			const newUser: User = payload;

			fetch("https://jsonplaceholder.typicode.com/users", {
				method: "POST",
				body: JSON.stringify(newUser),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
				},
			})
				.then((res) => {
					if (res.ok) {
						toast.success(`User ${newUser.name} created`);
					}
				})
				.catch((err) => {
					rollbackAddUser(previousState);
					toast.error(`Error creating user ${newUser.name}`);
					console.error(err);
				});
		}
	};

export const store = configureStore({
	reducer: {
		users: userReducer,
	},
	middleware: [persistanceLocalStorageMiddleware, syncWithDataBaseMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
