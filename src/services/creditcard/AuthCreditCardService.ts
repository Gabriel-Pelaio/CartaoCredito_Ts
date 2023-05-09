import { Infer, object, size, string } from "superstruct";
import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

const CreditCardAuthRequest = object({
  numeroCartao: size(string(), 16, 16),
  codigoSeguranca: size(string(), 3, 3),
});

type AuthRequest = Infer<typeof CreditCardAuthRequest>;

class AuthCreditCardService {
  async execute({ numeroCartao, codigoSeguranca }: AuthRequest) {
    const creditCard = await prismaClient.creditCard.findFirst({
      where: {
        numero_cartao: numeroCartao,
      },
    });

    if (!creditCard) {
      throw new Error("Cartão sem cadastro!");
    }

    const codigoSegurancaMatch = await compare(
      codigoSeguranca,
      creditCard.cod_seguranca
    );

    if (!codigoSegurancaMatch) {
      throw new Error("Código de segurança inválido!");
    }

    const token = sign(
      {
        nome: creditCard.nome_dono,
        numeroCartao: creditCard.numero_cartao,
      },
      process.env.JWT_SECRET,
      {
        subject: creditCard.id,
        expiresIn: "59s",
      }
    );
    return {
      id: creditCard.id,
      nome: creditCard.nome_dono,
      numeroCartao: creditCard.numero_cartao,
      token: token,
    };
  }
}

export { AuthCreditCardService };
