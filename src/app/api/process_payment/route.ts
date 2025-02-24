import { Payment, MercadoPagoConfig } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ accessToken: `${process.env.ACCESS_TOKEN}` });
const payment = new Payment(client);

export async function POST(request: NextRequest) {
    
    const req = await request.json();

    const body = {
        transaction_amount: req.transaction_amount,
        token: req.token,
        description: req.description,
        installments: req.installments,
        payment_method_id: req.payment_method_id,
        issuer_id: req.issuer_id,
        payer: {
          email: req.payer.email,
          identification: {
            type: req.payer.identification.type,
            number: req.payer.identification.number
    }}};

    try {
        const result = await payment.create({ body });

        // console.log(result.status)

        if(result.status === 'rejected'){
            throw new Error("Erro ao efetuar pagamento, tente novamente mais tarde.")
        }

        return NextResponse.json({ 'message': result.status }, { status: 200 });
    
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error }, { status: 400 });
    }
}
