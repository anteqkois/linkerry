import { ValidationInputType } from "../../validators/types";
import { BaseProperty, PropertyType, PropertyValue } from "../base";

export type DateTimeProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.DATE_TIME, ValidationInputType.DATE_TIME, R>
