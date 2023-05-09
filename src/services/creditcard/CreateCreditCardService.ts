import { assert, object, string, size, refine, Infer } from "superstruct";
import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

const CreditCard = object({
  nome: size(string(), 4, 50),
  numeroCartao: size(string(), 16, 16),
  validade: size(string(), 7, 7),
  codigoSeguranca: size(string(), 3, 3),
});

interface CreditCardRequest {
  nome: string;
  numeroCartao: string;
  validade: string;
  codigoSeguranca: string;
}

class CreateCreditCardService {
  async execute({
    nome,
    numeroCartao,
    validade,
    codigoSeguranca,
  }: CreditCardRequest) {
    if (!CreditCard.is({ nome, numeroCartao, validade, codigoSeguranca })) {
      throw new Error("Dados inválidos!");
    }
    if (!nome) {
      throw new Error("Nome não enviado!");
    }
    if (!numeroCartao) {
      throw new Error("Número do cartão não enviado!");
    }
    if (!validade) {
      throw new Error("Data de expiração não enviada!");
    } else {
      const data = new Date();
      const ano = data.getFullYear();
      const mes = data.getMonth() + 1;
      const [mesReq, anoReq] = validade.split("/");
      if (ano > Number(anoReq)) {
        throw new Error("Ano de validade menor que o atua!.");
      } else {
        if (mes > Number(mesReq)) {
          throw new Error("Mês de validade menor que o atual!");
        }
      }
    }
    if (!codigoSeguranca) {
      throw new Error("Código de segurança não enviado!");
    }

    const creditCardExists = await prismaClient.creditCard.findFirst({
      where: {
        numero_cartao: numeroCartao,
      },
    });

    if (creditCardExists) {
      throw new Error("Número de cartão já cadastrado!");
    }

    const codigoSegurancaHash = await hash(codigoSeguranca, 8);

    const creditCard = await prismaClient.creditCard.create({
      data: {
        nome_dono: nome,
        numero_cartao: numeroCartao,
        data_exp: validade,
        cod_seguranca: codigoSegurancaHash,
      },
      select: {
        id: true,
        nome_dono: true,
        numero_cartao: true,
        data_exp: true,
      },
    });

    return creditCard;
  }
}

export { CreateCreditCardService };
