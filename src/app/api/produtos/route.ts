
import { prisma } from "../../../../lib/prisma"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
    try {
      const produtos = await prisma.produto.findMany()
      return NextResponse.json({produtos}, {status: 200})
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao buscar produtos' }, {status: 400})
    }
}