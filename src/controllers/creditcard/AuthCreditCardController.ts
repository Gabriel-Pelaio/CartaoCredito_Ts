import { Request, Response } from "express";
import { AuthCreditCardService } from "../../services/creditcard/AuthCreditCardService";

class AuthCreditCardController {
  async handle(req: Request, res: Response) {
    const { numeroCartao, codigoSeguranca } = req.body;
    const authCreditCardService = new AuthCreditCardService();
    const auth = await authCreditCardService.execute({
      numeroCartao,
      codigoSeguranca,
    });
    return res.json(auth);
  }
}

export { AuthCreditCardController };
