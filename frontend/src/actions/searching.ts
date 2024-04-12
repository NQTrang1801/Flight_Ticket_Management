import { SEARCH } from "./types";

export const search = (query: string) => ({
    type: SEARCH,
    payload: query
});

export type SearchAction = ReturnType<typeof search>;
