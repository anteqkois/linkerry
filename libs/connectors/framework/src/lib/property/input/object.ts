import { ValidationInputType } from "../../validators/types";
import { BaseProperty, PropertyType, PropertyValue } from "../base";

export type ObjectProperty<R extends boolean> = BaseProperty &
    PropertyValue<
        Record<string, unknown>,
        PropertyType.OBJECT,
        ValidationInputType.OBJECT,
        R
    >;
