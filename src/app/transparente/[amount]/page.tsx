'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Transparente({ params }:any ) {

  const router = useRouter()


  const [mp, setMp] = useState(null);
  const { amount }: any = React.use(params)

  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  console.log(amount)

  console.log(amount)

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => {
      const mpInstance = new window.MercadoPago(`${process.env.MP_ACCESS_TOKEN}`, {
        locale: "pt-BR",
      });
      setMp(mpInstance);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (mp) {
      const cardForm = mp.cardForm({
        amount: `${amount}`,
        iframe: true,
        form: {
          id: "form-checkout",
          cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "Número do cartão",
          },
          expirationDate: {
            id: "form-checkout__expirationDate",
            placeholder: "MM/YY",
          },
          securityCode: {
            id: "form-checkout__securityCode",
            placeholder: "Código de segurança",
          },
          cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Titular do cartão",
          },
          issuer: {
            id: "form-checkout__issuer",
            placeholder: "Banco emissor",
          },
          installments: {
            id: "form-checkout__installments",
            placeholder: "Parcelas",
          },
          identificationType: {
            id: "form-checkout__identificationType",
            placeholder: "Tipo de documento",
          },
          identificationNumber: {
            id: "form-checkout__identificationNumber",
            placeholder: "Número do documento",
          },
          cardholderEmail: {
            id: "form-checkout__cardholderEmail",
            placeholder: "E-mail",
          },
        },
        callbacks: {
          onFormMounted: (error) => {
            if (error) return console.warn("Form Mounted handling error: ", error);
            console.log("Form mounted");
          },
          onSubmit: (event) => {
            event.preventDefault();

            const {
              paymentMethodId: payment_method_id,
              issuerId: issuer_id,
              cardholderEmail: email,
              amount,
              token,
              installments,
              identificationNumber,
              identificationType,
            } = cardForm.getCardFormData();

            const data = fetch("/api/process_payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token,
                issuer_id,
                payment_method_id,
                transaction_amount: Number(amount),
                installments: Number(installments),
                description: "Descrição do produto",
                payer: {
                  email,
                  identification: {
                    type: identificationType,
                    number: identificationNumber,
                  },
                },
              }),
            })
            .then((response) => {
              if (!response.ok) {
                  return Promise.reject(`Erro na requisição.`);
              }
              return response.json();
          })
          .then((res) => {
              console.log(res);
              router.push(`/transparente/successPayment`)
          })
          .catch((error) => {
              console.log('Falha na requisição:', error);
              router.push(`/transparente/failedPayment`)
          });
          
           
          },
          onFetching: (resource) => {
            console.log("Fetching resource: ", resource);

            // Animate progress bar
            const progressBar = document.querySelector(".progress-bar");
            progressBar.removeAttribute("value");

            return () => {
              progressBar.setAttribute("value", "0");
            };
          },
        },
      });
    }
  }, [mp]); // Dependência de mp

  return (
    <form id="form-checkout" style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}>
      <div id="form-checkout__cardNumber" className="container" style={{ height: '18px', display: 'inline-block', border: '1px solid rgb(118, 118, 118)', borderRadius: '2px', padding: '1px 2px' }}></div>
      <div id="form-checkout__expirationDate" className="container" style={{ height: '18px', display: 'inline-block', border: '1px solid rgb(118, 118, 118)', borderRadius: '2px', padding: '1px 2px' }}></div>
      <div id="form-checkout__securityCode" className="container" style={{ height: '18px', display: 'inline-block', border: '1px solid rgb(118, 118, 118)', borderRadius: '2px', padding: '1px 2px' }}></div>
      <input type="text" id="form-checkout__cardholderName" />
      <select id="form-checkout__issuer"></select>
      <select id="form-checkout__installments"></select>
      <select id="form-checkout__identificationType"></select>
      <input type="text" id="form-checkout__identificationNumber" />
      <input type="email" id="form-checkout__cardholderEmail" />

      <button type="submit" id="form-checkout__submit">Pagar</button>
      <progress value="0" className="progress-bar">Carregando...</progress>

      {errorMessage && (
        <>
          <p>{errorMessage}</p>
        </>
      )}
      {successMessage && (
        <>
          <p>{successMessage}</p>
        </>
      )}

    </form>
  );
}
