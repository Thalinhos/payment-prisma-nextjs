import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { produtos, tokenPagamento } = await req.json();

    if (!produtos || produtos.length === 0 || !tokenPagamento) {
      throw new Error("Produtos e token de pagamento são obrigatórios.");
    }

    const result = await prisma.$transaction(async (prisma) => {
      const produtosParaVenda = [];

      for (let produtoData of produtos) {
        const { id, quantidade } = produtoData;

        const produto = await prisma.produto.findUnique({
          where: { id: id }
        });

        if (!produto) {
          throw new Error(`Produto ${id} não encontrado`);
        }

        if (produto.quantidade < quantidade) {
          throw new Error(`Estoque insuficiente para o produto ${produto.nome}`);
        }

        await prisma.produto.update({
          where: { id: id },
          data: {
            quantidade: produto.quantidade - quantidade,
          },
        });

        produtosParaVenda.push({
          produtoId: id,
          quantidade,
          precoUnitario: produto.preco,
        });
      }

      const confirmPayment = await fetch('http://localhost:3000/api/webhookfake');
      const confirmPaymentRes = await confirmPayment.json();

      if (confirmPaymentRes.status === "fail") {
        throw new Error("Erro ao efetuar pagamento");
      }

      const venda = await prisma.venda.create({
        data: {
          produtosVenda: {
            create: produtosParaVenda,
          },
        },
      });

      return venda;
    });

    return NextResponse.json({ "msg": "Sucesso ao efetuar pagamento" }, { status: 200 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ "errorMessage": error.message }, { status: 400 });
  } finally {
    await prisma.$disconnect();
  }
}
