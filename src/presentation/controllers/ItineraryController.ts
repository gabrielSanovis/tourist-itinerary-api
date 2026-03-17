import { Request, Response, NextFunction } from "express";
import { GenerateItineraryUseCase } from "../../application/use-cases/GenerateItineraryUseCase";
import { GenerateItineraryInput } from "../../application/dtos/GenerateItineraryInput";

export class ItineraryController {
  constructor(
    private readonly generateItineraryUseCase: GenerateItineraryUseCase
  ) {}

  public generate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input: GenerateItineraryInput = req.body as GenerateItineraryInput;

      const output = await this.generateItineraryUseCase.execute(input);

      res.status(200).json({
        status: "success",
        data: output,
      });
    } catch (err) {
      next(err);
    }
  };
}
