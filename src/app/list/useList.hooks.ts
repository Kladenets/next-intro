import { getTodos } from "../../../lib/connect";
import { TodosRecord } from "../../../pocketbase_0.26.2_darwin_arm64/pocketbase-types";

export const useList = async () => {
    const data: TodosRecord[] = await getTodos();

    return data;
};