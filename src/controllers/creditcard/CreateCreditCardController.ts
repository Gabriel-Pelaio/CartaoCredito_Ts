import { Request, response, Response } from "express";
import { CreateCreditCardService } from "../../services/creditcard/CreateCreditCardService";

class CreateCreditCardController {
  async handle(req: Request, res: Response) {
    const { nome, numeroCartao, validade, codigoSeguranca } = req.body;
    const createCreditCardService = new CreateCreditCardService();
    const creditCard = await createCreditCardService.execute({
      nome,
      numeroCartao,
      validade,
      codigoSeguranca,
    });

    return res.json(creditCard);
  }
}

export { CreateCreditCardController };
