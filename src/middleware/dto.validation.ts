import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

import Logger from "../provider/logger.ts";

export function validateDto<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    Logger.info(validateDto.name, `Validating DTO: ${dtoClass.name}`);
    const dtoObj = plainToInstance(dtoClass, req.body);

    const errors = await validate(dtoObj, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      Logger.warn(validateDto.name, "Validation errors found");
      const messages = errors
        .map((err) => Object.assign({ field: err.property, constraints: err.constraints }))
        .flat();

      res.status(400).json({
        status: 400,
        message: "Validation failed",
        details: messages,
      });
      return;
    }

    next();
  };
}
