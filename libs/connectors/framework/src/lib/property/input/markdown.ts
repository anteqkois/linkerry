import { ValidationInputType } from "../../validators/types";
import { BaseProperty, PropertyType, PropertyValue } from "../base";

export type MarkDownProperty = BaseProperty &
    PropertyValue<
        string,
        PropertyType.MARKDOWN,
        ValidationInputType.ANY,
        false
    >;
