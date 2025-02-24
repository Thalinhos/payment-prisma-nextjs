'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


export default function CartComponent({ atualiza, setAtualiza }: any) {

    
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [amount, setAmount] = useState(0);
    
    useEffect(() => {
        function getCart() {
            const cartData: any[] = [];
            
            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith('cart-products-')) {
                    const product = JSON.parse(localStorage.getItem(key)!);
                    cartData.push(product);
                }
            });
            
            setCartItems(cartData);
        }
        
        getCart(); 
    }, [atualiza]);
    
    const router = useRouter();

    useEffect(() => {
        let totalAmount = 0;
        cartItems.forEach(item => {
            const preco = Number(item.preco);
            const quantidade = Number(item.quantidade);

            if (!isNaN(preco) && !isNaN(quantidade)) {
                totalAmount += preco * quantidade;
            } else {
                console.warn(`Invalid values for item ${item.nome}: preco or quantidade is not a number`);
            }
        });
        setAmount(totalAmount);
    }, [cartItems]);

    function zeraCarrinho() {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('cart-products-')) {
                localStorage.removeItem(key);
            }
        });
        setAtualiza(!atualiza);  
    }

    function goToPayment() {
        router.push(`/transparente/${amount}`)
    }

    return (
        <>  
            <p>Cart</p>
            <ul>
                {cartItems.length > 0 ? (
                    <>
                        {cartItems.map((item, index) => (
                            <li key={index}>
                                <p>Nome: {item.nome}</p>
                                <p>Quantidade: {item.quantidade}</p>
                                <p>Preço: {item.preco}</p>
                            </li>
                        ))}
                        <p>Total: {amount}</p>
                        <button onClick={goToPayment}>Ir ao pagamento</button>
                        <br /><br />
                        <button onClick={zeraCarrinho}>Zerar Carrinho</button>
                    </>
                ) : (
                    <p>Seu carrinho está vazio.</p>
                )}
            </ul>
        </>
    );
}
