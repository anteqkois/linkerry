import { WinstonModuleOptions } from "nest-winston";
import { transports, format } from 'winston';

export const WinstonConfig: WinstonModuleOptions = {
  transports: [
    // let's log errors into its own file
    new transports.File({
      filename: `logs/error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    // logging all level
    new transports.File({
      filename: `logs/combined.log`,
      format: format.combine(format.timestamp(), format.json()),
    }),
    // we also want to see logs in our console
    new transports.Console({
      format: format.combine(
        format.cli(),
        format.splat(),
        format.timestamp(),
        format.printf((info) => {
          return `${ info['timestamp'] } ${ info.level }: ${ info.message }`;
        }),
      ),
    }),
  ],
}
