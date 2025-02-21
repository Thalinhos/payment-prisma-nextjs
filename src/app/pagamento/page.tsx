// 'use client'
// import { useEffect } from "react";

// const CardPayment = () => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://sdk.mercadopago.com/js/v2";
//     script.onload = () => {
//       const mp = new window.MercadoPago("TEST-d0362208-30ab-426d-90d8-b0779c5d61a6", {
//         locale: "pt-BR",
//       });

//       const bricksBuilder = mp.bricks();

//       const renderCardPaymentBrick = async () => {
//         const settings = {
//           initialization: {
//             amount: 100, // valor total a ser pago
//             payer: {
//               email: "",
//             },
//           },
//           customization: {
//             visual: {
//               style: {
//                 theme: "default", // | 'dark' | 'bootstrap' | 'flat'
//                 customVariables: {},
//               },
//             },
//             paymentMethods: {
//               maxInstallments: 1,
//             },
//           },
//           callbacks: {
//             onReady: () => {
//             },
//             onSubmit: (cardFormData) => {
//               return new Promise((resolve, reject) => {
//                 fetch("/api/processPayment", {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify(cardFormData),
//                 })
//                   .then((response) => {
//                     resolve();
//                   })
//                   .catch((error) => {
//                     reject();
//                   });
//               });
//             },
//             onError: (error) => {
//             },
//           },
//         };

//         window.cardPaymentBrickController = await bricksBuilder.create(
//           "cardPayment",
//           "cardPaymentBrick_container",
//           settings
//         );
//       };

//       renderCardPaymentBrick();
//     };

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div>
//       <div id="cardPaymentBrick_container"></div>
//     </div>
//   );
// };

// export default CardPayment;



// import { MercadoPagoConfig, Payment } from 'mercadopago';

// const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });

// const payment = new Payment(client);
// payment.create({ body: req.body })
// .then(console.log)
// .catch(console.log);