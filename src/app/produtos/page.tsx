'use client'

import { Produto } from "@prisma/client"
import { useEffect, useState } from "react"
import CartComponent from "./components/cart-component"

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [quantidadeAComprar, setQuantidadeAComprar] = useState(0)
  const [atualiza, setAtualiza] = useState(false);
 
  useEffect(() => {
    async function fetchProdutos() {
      const response = await fetch('/api/produtos')
      const data = await response.json()
      setProdutos(data.produtos)
    }

    fetchProdutos()
  }, [])


  function setDataToCart(id: number, nome: string, preco: number, quantidade: number) {
    const obj = {
      id,
      nome, 
      preco, 
      quantidade
    }

    localStorage.setItem(`cart-products-${nome}`, JSON.stringify(obj));

    setAtualiza(!atualiza);
  }

  return (
    <>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ flex: 20 }}>
                <p>Produtos</p>
            </div>
            <div style={{ flex: 1 }}>
                <CartComponent atualiza={atualiza} setAtualiza={setAtualiza}/>
            </div>
        </div>



      {produtos.map((p: Produto) => (
        <ul key={p.id}>
          <li>
            <p>ID: {p.id}</p>
            <p>Nome: {p.nome}</p>
            <p>Preço: {p.preco}</p>
            <p>Quantidade: {p.quantidade}</p>
          </li>

            <input type="number" name="" id="" placeholder="Quantidade a comprar" onChange={(e) => setQuantidadeAComprar(Number(e.target.value))}/>

          <button onClick={() => setDataToCart(p.id, p.nome, p.preco, quantidadeAComprar)}>
            Add to Cart
          </button>
        </ul>
      ))}
    </>
  )
}
