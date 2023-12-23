import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsArrayLiteral(literalEntities: string[], validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isArrayLiteral',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [literalEntities],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          console.log('relatedPropertyName', relatedPropertyName);

          const relatedValue = (args.object as any)[relatedPropertyName];
          console.log('relatedValue', relatedValue);

          console.log('value', value);
          return true
          // return typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
