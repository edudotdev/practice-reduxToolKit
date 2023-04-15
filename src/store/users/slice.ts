import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const DEFAULT_STATE = [
	{
		id: "1",
		name: "Peter Doe",
		email: "peterdoe@gmail.com",
		github: "adalbertopc",
	},
	{
		id: "2",
		name: "Poke Saiyan",
		email: "poke_saiyan@gmail.com",
		github: "pokedotdev",
	},
	{
		id: "3",
		name: "Eduardo RL",
		email: "eduardo.robles@gmail.com",
		github: "edudotdev",
	},
	{
		id: "4",
		name: "JebusDerp",
		email: "jebus@gmail.com",
		github: "Jebus-Dev",
	},
];

export type UserID = string;

export interface User {
	name: string;
	email: string;
	github: string;
}

export interface UserWithId extends User {
	id: UserID;
}

const initialState: UserWithId[] = (() => {
	const persistenceState = localStorage.getItem("redux_state");
	if (persistenceState) return JSON.parse(persistenceState).users;
	return DEFAULT_STATE;
})();

export const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		addNewUser: (state, action: PayloadAction<User>) => {
			const id = crypto.randomUUID();
			state.push({ id, ...action.payload });
		},
		deleteUserById: (state, action: PayloadAction<UserID>) => {
			const id = action.payload;
			return state.filter((user) => user.id !== id);
		},
		rollbackRemoveUser: (state, action: PayloadAction<UserWithId>) => {
			console.log("uwu");
			const isUserAlreadyDefined = state.some(
				(user) => user.id === action.payload.id,
			);
			if (!isUserAlreadyDefined) {
				state.push(action.payload);
			}
		},
		rollbackAddUser: (state, action: PayloadAction<UserWithId[]>) => {
			console.log("pop");
			state.pop();
		},
	},
});

export default usersSlice.reducer;

export const {
	addNewUser,
	deleteUserById,
	rollbackRemoveUser,
	rollbackAddUser,
} = usersSlice.actions;
