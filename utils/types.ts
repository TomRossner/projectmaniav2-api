// Types

type Priority = 'low' | 'medium' | 'high';

type Tag = 'bug' | 'ui' | 'feature' | 'hotfix' | 'backend';

type Model = "task" | "stage" | "project" | "user";

type SelectedFields<T extends {[key: string]: any}, E extends ExcludedFieldKeys> = Omit<T, E>;

type ExcludedFieldKeys = "_id" | "__v" | "password" | "socketId" | "userId";

type ExcludedFieldValue = 0;

type ExcludedFields = {
    [key in ExcludedFieldKeys]: ExcludedFieldValue;
};

export {
    Priority,
    Tag,
    Model,
    ExcludedFieldKeys,
    SelectedFields,
    ExcludedFields,
    ExcludedFieldValue,
}